"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@apollo/client";
import { graphqlQuery } from "@/lib/graphql-client";
import {
  Modal,
  TextInput,
  Select,
  MultiSelect,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  UPDATE_SCAN,
  GET_CATEGORIES,
  GET_TAGS,
  GET_SCAN_LIST,
} from "@/lib/graphql/queries";
import type { Scan, Category, Tag, ScanType } from "@/types";
import { SCAN_TYPE_LABELS } from "@/types";

const SCAN_TYPES = Object.entries(SCAN_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface ScanEditModalProps {
  scan: Scan;
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ScanEditModal({
  scan,
  opened,
  onClose,
  onSaved,
}: ScanEditModalProps) {
  const [name, setName] = useState(scan.name);
  const [author, setAuthor] = useState(scan.author);
  const [type, setType] = useState<string>(scan.type);
  const [categoryId, setCategoryId] = useState<string>(String(scan.categoryId));
  const [receivedAt, setReceivedAt] = useState<string>(scan.receivedAt);
  const [tagIds, setTagIds] = useState<string[]>(
    scan.tags.map((t) => String(t.id))
  );
  const [linkedScanIds, setLinkedScanIds] = useState<string[]>(
    scan.linkedScans.map((s) => String(s.id))
  );

  useEffect(() => {
    setName(scan.name);
    setAuthor(scan.author);
    setType(scan.type);
    setCategoryId(String(scan.categoryId));
    setTagIds(scan.tags.map((t) => String(t.id)));
    setLinkedScanIds(scan.linkedScans.map((s) => String(s.id)));
    setReceivedAt(scan.receivedAt);
  }, [scan]);

  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery<{ categories: Category[] }, Error>({
    queryKey: ["categories"],
    queryFn: () => graphqlQuery<{ categories: Category[] }>(GET_CATEGORIES),
  });

  const { data: tagsData } = useQuery<{ tags: Tag[] }, Error>({
    queryKey: ["tags"],
    queryFn: () => graphqlQuery<{ tags: Tag[] }>(GET_TAGS),
  });

  const { data: scansData } = useQuery<{ scans: { scans: { id: number; name: string }[] } }, Error>({
    queryKey: ["scanList"],
    queryFn: () => graphqlQuery<{ scans: { scans: { id: number; name: string }[] } }>(GET_SCAN_LIST),
  });

  const [updateScan, { loading }] = useMutation(UPDATE_SCAN, {
    onCompleted: () => {
      notifications.show({
        title: "Modifié",
        message: "Le scan a été mis à jour",
        color: "violet",
      });
      onSaved();
      queryClient.invalidateQueries(["scans"] as any);
    },
    onError: (error: any) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const categoryOptions = (categoriesData?.categories ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const tagOptions = (tagsData?.tags ?? []).map((t) => ({
    value: String(t.id),
    label: t.name,
  }));

  const handleSubmit = () => {
    updateScan({
      variables: {
        id: scan.id,
        input: {
          name,
          author,
          type: type as ScanType,
          categoryId: parseInt(categoryId),
          tagIds: tagIds.map(Number),
          linkedScanIds: linkedScanIds.map(Number),
        },
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Modifier le scan" size="md">
      <Stack>
        <TextInput
          label="Nom"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Auteur"
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Date de réception"
          value={receivedAt}
          onChange={(e) => setReceivedAt(e.currentTarget.value)}
          type="date"
          required
        />
        <Select
          label="Type"
          data={SCAN_TYPES}
          value={type}
          onChange={(val) => val && setType(val)}
          required
        />
        <Select
          label="Catégorie"
          data={categoryOptions}
          value={categoryId}
          onChange={(val) => val && setCategoryId(val)}
          required
        />
        <MultiSelect
          label="Tags"
          data={tagOptions}
          value={tagIds}
          onChange={setTagIds}
        />
        <MultiSelect
          label="Scans liés"
          data={(scansData?.scans.scans ?? [])
            .filter((s) => s.id !== scan.id)
            .map((s) => ({ value: String(s.id), label: s.name }))}
          value={linkedScanIds}
          onChange={setLinkedScanIds}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} loading={loading} color="violet">
            Sauvegarder
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
