"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@apollo/client";
import { graphqlQuery } from "@/lib/graphql-client";
import {
  Card,
  Text,
  Group,
  Badge,
  Image,
  SimpleGrid,
  Stack,
  Title,
  TextInput,
  Select,
  MultiSelect,
  ActionIcon,
  Tooltip,
  Pagination,
  Skeleton,
  Modal,
  Menu,
  Box,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconSearch,
  IconFilter,
  IconTrash,
  IconEdit,
  IconEye,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import {
  GET_SCANS,
  GET_CATEGORIES,
  GET_TAGS,
  DELETE_SCAN,
} from "@/lib/graphql/queries";
import type {
  Scan,
  PaginatedScans,
  Category,
  Tag,
  ScanFilter,
  ScanType,
} from "@/types";
import { SCAN_TYPE_LABELS } from "@/types";
import { getScanImageUrl, formatFileSize, formatDate } from "@/lib/utils";
import ScanEditModal from "./ScanEditModal";
import ScanViewModal from "./ScanViewModal";

const SCAN_TYPES = Object.entries(SCAN_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function ScanList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ScanFilter>({});
  const [search, setSearch] = useState("");
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [editModalOpened, editModal] = useDisclosure(false);
  const [viewModalOpened, viewModal] = useDisclosure(false);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
  } = useQuery<{ scans: PaginatedScans }, Error>(
    ({
      queryKey: ["scans", page, filter],
      queryFn: () =>
        graphqlQuery<{ scans: PaginatedScans }>(GET_SCANS, {
          page,
          pageSize: 12,
          filter,
        }),
      keepPreviousData: true,
    } as any) as any
  );

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(
    ({
      queryKey: ["categories"],
      queryFn: () => graphqlQuery<{ categories: Category[] }>(GET_CATEGORIES),
    } as any) as any
  );
  const { data: tagsData } = useQuery<{ tags: Tag[] }>(
    ({
      queryKey: ["tags"],
      queryFn: () => graphqlQuery<{ tags: Tag[] }>(GET_TAGS),
    } as any) as any
  );

  const [deleteScan] = useMutation(DELETE_SCAN, {
    onCompleted: () => {
      notifications.show({
        title: "Supprimé",
        message: "Le scan a été supprimé avec succès",
        color: "violet",
      });
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

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search: search || undefined }));
    setPage(1);
  };

  const handleDeleteScan = (scan: Scan) => {
    if (confirm(`Supprimer "${scan.name}" ?`)) {
      deleteScan({ variables: { id: scan.id } });
    }
  };

  const handleEditScan = (scan: Scan) => {
    setSelectedScan(scan);
    editModal.open();
  };

  const handleViewScan = (scan: Scan) => {
    setSelectedScan(scan);
    viewModal.open();
  };

  const clearFilters = () => {
    setFilter({});
    setSearch("");
    setPage(1);
  };

  const scans = data?.scans?.scans ?? [];
  const totalPages = data?.scans?.totalPages ?? 1;
  const total = data?.scans?.total ?? 0;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <Title order={2} c="white">
          Scans ({total})
        </Title>
        {Object.keys(filter).length > 0 && (
          <Tooltip label="Réinitialiser les filtres">
            <ActionIcon variant="subtle" color="gray" onClick={clearFilters}>
              <IconX size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      {/* Filters */}
      <Card padding="md">
        <Flex gap="sm" wrap="wrap" align="flex-end">
          <TextInput
            placeholder="Rechercher par nom ou auteur..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            placeholder="Type"
            data={SCAN_TYPES}
            value={filter.type ?? null}
            onChange={(val) => {
              setFilter((prev) => ({
                ...prev,
                type: (val as ScanType) || undefined,
              }));
              setPage(1);
            }}
            clearable
            w={150}
          />
          <Select
            placeholder="Catégorie"
            data={categoryOptions}
            value={filter.categoryId ? String(filter.categoryId) : null}
            onChange={(val) => {
              setFilter((prev) => ({
                ...prev,
                categoryId: val ? parseInt(val) : undefined,
              }));
              setPage(1);
            }}
            clearable
            w={180}
          />
          <MultiSelect
            placeholder="Tags"
            data={tagOptions}
            value={(filter.tagIds ?? []).map(String)}
            onChange={(vals) => {
              setFilter((prev) => ({
                ...prev,
                tagIds: vals.length ? vals.map(Number) : undefined,
              }));
              setPage(1);
            }}
            clearable
            w={220}
          />
        </Flex>
      </Card>

      {/* Scan Grid */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : scans.length === 0 ? (
        <Card padding="xl">
          <Text ta="center" c="dimmed" size="lg">
            Aucun scan trouvé
          </Text>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {scans.map((scan) => (
            <Card key={scan.id} padding={0} style={{ overflow: "hidden" }}>
              <Box
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => handleViewScan(scan)}
              >
                <Image
                  src={getScanImageUrl(scan.filePath)}
                  alt={scan.name}
                  h={180}
                  fit="cover"
                  fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJlMmUyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjk2OTY5IiBmb250LXNpemU9IjE0Ij5QYXMgZCdhcGVyw6d1PC90ZXh0Pjwvc3ZnPg=="
                />
                <Badge
                  size="sm"
                  variant="filled"
                  color="violet"
                  style={{ position: "absolute", top: 8, left: 8 }}
                >
                  {SCAN_TYPE_LABELS[scan.type]}
                </Badge>
              </Box>

              <Stack gap="xs" p="sm">
                <Group justify="space-between" wrap="nowrap">
                  <Text fw={600} c="white" lineClamp={1} size="sm">
                    {scan.name}
                  </Text>
                  <Menu shadow="md" width={160}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleViewScan(scan)}
                      >
                        Voir
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleEditScan(scan)}
                      >
                        Modifier
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeleteScan(scan)}
                      >
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Text size="xs" c="dimmed">
                  {scan.author} · {formatFileSize(scan.fileSize)}
                </Text>

                <Group gap={4}>
                  <Badge size="xs" variant="light" color="grape">
                    {scan.category.name}
                  </Badge>
                  {scan.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} size="xs" variant="outline" color="violet">
                      {tag.name}
                    </Badge>
                  ))}
                  {scan.tags.length > 2 && (
                    <Badge size="xs" variant="outline" color="dark">
                      +{scan.tags.length - 2}
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            color="violet"
          />
        </Group>
      )}

      {/* Edit Modal */}
      {selectedScan && (
        <ScanEditModal
          scan={selectedScan}
          opened={editModalOpened}
          onClose={() => {
            editModal.close();
            setSelectedScan(null);
          }}
          onSaved={() => {
            editModal.close();
            setSelectedScan(null);
            queryClient.invalidateQueries(["scans"] as any);
          }}
        />
      )}

      {/* View Modal */}
      {selectedScan && (
        <ScanViewModal
          scan={selectedScan}
          opened={viewModalOpened}
          onClose={() => {
            viewModal.close();
            setSelectedScan(null);
          }}
        />
      )}
    </Stack>
  );
}
