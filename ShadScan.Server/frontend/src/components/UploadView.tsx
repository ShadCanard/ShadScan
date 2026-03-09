"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@apollo/client";
import { graphqlQuery } from "@/lib/graphql-client";
import {
  Card,
  Text,
  Stack,
  Title,
  TextInput,
  Select,
  MultiSelect,
  Autocomplete,
  Button,
  Group,
  Progress,
  SimpleGrid,
  Badge,
  Image,
  ActionIcon,
  AspectRatio,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconPhoto, IconX, IconTrash, IconFileTypePdf } from "@tabler/icons-react";
import { GET_CATEGORIES, GET_TAGS, CREATE_SCAN, GET_SCAN_LIST, CREATE_CATEGORY, CREATE_TAG, GET_AUTHORS } from "@/lib/graphql/queries";
import type { Category, Tag, ScanType } from "@/types";
import { SCAN_TYPE_LABELS } from "@/types";
import { formatFileSize } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const SCAN_TYPES = Object.entries(SCAN_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const ACCEPTED_MIME_TYPES = [
  ...IMAGE_MIME_TYPE,
  "application/pdf",
  "image/tiff",
  "image/bmp",
];

interface FileToUpload {
  file: File;
  name: string;
  preview: string;
}

export default function UploadView() {
  const [files, setFiles] = useState<FileToUpload[]>([]);
  const [author, setAuthor] = useState("");

  // fetch authors for autocomplete
  const { data: authorsData } = useQuery<{ authors: string[] }, Error>({
    queryKey: ["authors"],
    queryFn: () => graphqlQuery<{ authors: string[] }>(GET_AUTHORS),
  });
  const [receivedAt, setReceivedAt] = useState("");
  const [type, setType] = useState<string>("UNKNOWN");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [existingScanId, setExistingScanId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: (data) => {
      const cat = data.createCategory;
      setCategoryOptions((prev) => [...prev, { value: String(cat.id), label: cat.name }]);
      setCategoryId(String(cat.id));
    },
  });

  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: (data) => {
      const tag = data.createTag;
      setTagOptions((prev) => [...prev, { value: String(tag.id), label: tag.name }]);
      setTagIds((prev) => [...prev, String(tag.id)]);
    },
  });

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>(
    (categoriesData?.categories ?? []).map((c) => ({ value: String(c.id), label: c.name }))
  );

  const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>(
    (tagsData?.tags ?? []).map((t) => ({ value: String(t.id), label: t.name }))
  );

  // keep options in sync when data loads/refetches
  useEffect(() => {
    if (categoriesData?.categories) {
      setCategoryOptions(
        categoriesData.categories.map((c) => ({ value: String(c.id), label: c.name }))
      );
    }
  }, [categoriesData]);
  useEffect(() => {
    if (tagsData?.tags) {
      setTagOptions(tagsData.tags.map((t) => ({ value: String(t.id), label: t.name })));
    }
  }, [tagsData]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name.replace(/\.[^/.]+$/, ""),
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpload = async () => {
    // ensure category/tag existence before uploading
    if (!existingScanId) {
      if (categoryId === "") {
        notifications.show({ title: "Erreur", message: "Catégorie invalide", color: "red" });
        return;
      }
      // check category exists, otherwise create it
      if (!categoryOptions.find((c) => c.value === categoryId)) {
        const res = await createCategory({ variables: { input: { name: categoryId } } });
        const newId = String(res.data.createCategory.id);
        setCategoryId(newId);
      }

      // ensure tags exist
      for (let i = 0; i < tagIds.length; i++) {
        const t = tagIds[i];
        if (!tagOptions.find((opt) => opt.value === t)) {
          const res = await createTag({ variables: { input: { name: t } } });
          const newId = String(res.data.createTag.id);
          setTagIds((prev) => prev.map((x) => (x === t ? newId : x)));
        }
      }
    }
    if (files.length === 0) {
      notifications.show({
        title: "Champs requis",
        message: "Veuillez ajouter au moins un fichier",
        color: "orange",
      });
      return;
    }
    if (!existingScanId && (!author || !categoryId)) {
      notifications.show({
        title: "Champs requis",
        message: "Veuillez remplir l'auteur et la catégorie si vous créez un nouveau scan",
        color: "orange",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      let completed = 0;

      for (const fileItem of files) {
        const formData = new FormData();
        formData.append("file", fileItem.file);
        if (existingScanId) {
          formData.append("scanId", existingScanId);
        } else {
          formData.append("name", fileItem.name);
          formData.append("author", author);
          formData.append("type", type);
          formData.append("categoryId", categoryId);
          formData.append("tagIds", JSON.stringify(tagIds.map(Number)));
          formData.append("receivedAt", receivedAt);
        }

        const response = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }

      notifications.show({
        title: "Succès",
        message: `${files.length} fichier(s) importé(s) avec succès`,
        color: "violet",
      });

      // Cleanup
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setProgress(0);
    } catch (error) {
      notifications.show({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'import",
        color: "red",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2} c="white">
        Importer des scans
      </Title>

      {/* Upload Zone */}
      <Card padding="lg">
        <Dropzone
          onDrop={handleDrop}
          accept={ACCEPTED_MIME_TYPES}
          maxSize={50 * 1024 * 1024}
          disabled={uploading}
        >
          <Group
            justify="center"
            gap="xl"
            mih={160}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={52}
                color="var(--mantine-color-violet-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={52}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                size={52}
                color="var(--mantine-color-violet-4)"
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="lg" c="white" inline>
                Glissez vos fichiers ici ou cliquez pour sélectionner
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Images (JPEG, PNG, TIFF, BMP, WebP, GIF) et PDF - Max 50 Mo par
                fichier
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Card>

      {/* File Preview */}
      {files.length > 0 && (
        <Card padding="lg">
          <Text size="sm" fw={700} c="dimmed" tt="uppercase" mb="sm">
            Fichiers sélectionnés ({files.length})
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }}>
            {files.map((f, index) => (
              <Card key={index} padding="xs" style={{ position: "relative" }}>
                <ActionIcon
                  size="xs"
                  variant="filled"
                  color="red"
                  style={{ position: "absolute", top: 4, right: 4, zIndex: 10 }}
                  onClick={() => removeFile(index)}
                >
                  <IconTrash size={10} />
                </ActionIcon>
                <AspectRatio ratio={297 / 210} style={{ width: '100%' }}>
                  {f.file.type === 'application/pdf' ? (
                    <Group justify="center" style={{ height: '100%' }}>
                      <IconFileTypePdf size={48} color="white" />
                    </Group>
                  ) : (
                    <Image
                      src={f.preview}
                      alt={f.name}
                      fit="cover"
                      radius="sm"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </AspectRatio>
                <Text size="xs" c="white" lineClamp={1} mt={4}>
                  {f.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatFileSize(f.file.size)}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Card>
      )}

      {/* Upload Form */}
      <Card padding="lg">
        <Text size="sm" fw={700} c="dimmed" tt="uppercase" mb="sm">
          Informations
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Scan existant (optionnel)"
            placeholder="Choisir un scan pour y ajouter les fichiers"
            data={(scansData?.scans.scans ?? []).map((s) => ({
              value: String(s.id),
              label: s.name,
            }))}
            value={existingScanId}
            onChange={(val) => setExistingScanId(val || "")}
            clearable
          />
          <Autocomplete
            label="Auteur"
            placeholder="Nom de l'auteur"
            value={author}
            onChange={setAuthor}
            data={authorsData?.authors ?? []}
            required={!existingScanId}
            disabled={!!existingScanId}
          />
          <Select
            label="Type"
            data={SCAN_TYPES}
            value={type}
            onChange={(val) => val && setType(val)}
            required={!existingScanId}
            disabled={!!existingScanId}
          />
          <Select
            label="Catégorie"
            data={categoryOptions}
            value={categoryId}
            onChange={(val) => val && setCategoryId(val)}
            required={!existingScanId}
            disabled={!!existingScanId}
          />
          <MultiSelect
            label="Tags"
            data={tagOptions}
            value={tagIds}
            onChange={setTagIds}
            disabled={!!existingScanId}
          />
          <TextInput
            label="Date de réception"
            placeholder="YYYY-MM-DD"
            value={receivedAt}
            onChange={(e) => setReceivedAt(e.currentTarget.value)}
            type="date"
            disabled={!!existingScanId}
          />
        </SimpleGrid>

        {uploading && (
          <Progress value={progress} color="violet" mt="md" animated />
        )}

        <Group justify="flex-end" mt="lg">
          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={files.length === 0}
            color="violet"
            size="md"
            leftSection={<IconUpload size={18} />}
          >
            Importer {files.length > 0 ? `(${files.length})` : ""}
          </Button>
        </Group>
      </Card>
    </Stack>
  );
}
