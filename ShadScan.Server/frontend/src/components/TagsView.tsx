"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@apollo/client";
import { graphqlQuery } from "@/lib/graphql-client";
import {
  Card,
  Text,
  Stack,
  Title,
  TextInput,
  Button,
  Group,
  Table,
  ActionIcon,
  Modal,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import {
  GET_TAGS,
  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG,
} from "@/lib/graphql/queries";
import type { Tag } from "@/types";
import { formatDate } from "@/lib/utils";

export default function TagsView() {
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [modalOpened, modal] = useDisclosure(false);

  const queryClient = useQueryClient();
  const { data } = useQuery<{ tags: Tag[] }, Error>({
    queryKey: ["tags"],
    queryFn: () => graphqlQuery<{ tags: Tag[] }>(GET_TAGS),
  });

  const [createTag, { loading: creating }] = useMutation(CREATE_TAG, {
    onCompleted: () => {
      notifications.show({
        title: "Créé",
        message: "Tag créé avec succès",
        color: "violet",
      });
      setNewName("");
      queryClient.invalidateQueries(["tags"] as any);
    },
    onError: (error) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const [updateTag, { loading: updating }] = useMutation(UPDATE_TAG, {
    onCompleted: () => {
      notifications.show({
        title: "Modifié",
        message: "Tag mis à jour",
        color: "violet",
      });
      modal.close();
      queryClient.invalidateQueries(["tags"] as any);
    },
    onError: (error) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const [deleteTag] = useMutation(DELETE_TAG, {
    onCompleted: () => {
      notifications.show({
        title: "Supprimé",
        message: "Tag supprimé",
        color: "violet",
      });
      queryClient.invalidateQueries(["tags"] as any);
    },
    onError: (error) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createTag({ variables: { input: { name: newName.trim() } } });
  };

  const handleEdit = (tag: Tag) => {
    setEditId(tag.id);
    setEditName(tag.name);
    modal.open();
  };

  const handleUpdate = () => {
    if (!editName.trim() || !editId) return;
    updateTag({ variables: { id: editId, input: { name: editName.trim() } } });
  };

  const handleDelete = (tag: Tag) => {
    if (confirm(`Supprimer le tag "${tag.name}" ?`)) {
      deleteTag({ variables: { id: tag.id } });
    }
  };

  const tags = data?.tags ?? [];

  return (
    <Stack gap="lg">
      <Title order={2} c="white">
        Tags
      </Title>

      {/* Create Form */}
      <Card padding="lg">
        <Group>
          <TextInput
            placeholder="Nouveau tag..."
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleCreate}
            loading={creating}
            color="violet"
            leftSection={<IconPlus size={16} />}
          >
            Ajouter
          </Button>
        </Group>
      </Card>

      {/* Tags Table */}
      <Card padding={0}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Créé le</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tags.map((tag) => (
              <Table.Tr key={tag.id}>
                <Table.Td>
                  <Badge variant="outline" color="violet">
                    {tag.name}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {formatDate(tag.createdAt)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon
                      variant="subtle"
                      color="violet"
                      size="sm"
                      onClick={() => handleEdit(tag)}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => handleDelete(tag)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {tags.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center" c="dimmed" py="md">
                    Aucun tag
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={modal.close}
        title="Modifier le tag"
        size="sm"
      >
        <Stack>
          <TextInput
            label="Nom"
            value={editName}
            onChange={(e) => setEditName(e.currentTarget.value)}
            required
          />
          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={modal.close}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} loading={updating} color="violet">
              Sauvegarder
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
