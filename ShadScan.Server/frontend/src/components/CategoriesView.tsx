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
  Badge,
  Modal,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconEdit, IconTrash, IconChevronDown } from "@tabler/icons-react";
import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/queries";
import type { Category } from "@/types";
import { formatDate } from "@/lib/utils";

export default function CategoriesView() {
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [modalOpened, modal] = useDisclosure(false);

  const queryClient = useQueryClient();
  const { data } = useQuery<{ categories: Category[] }, Error>({
    queryKey: ["categories"],
    queryFn: () => graphqlQuery<{ categories: Category[] }>(GET_CATEGORIES),
  });


  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      notifications.show({
        title: "Créée",
        message: "Catégorie créée avec succès",
        color: "violet",
      });
      setNewName("");
      queryClient.invalidateQueries(["categories"] as any);
    },
    onError: (error) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      notifications.show({
        title: "Modifiée",
        message: "Catégorie mise à jour",
        color: "violet",
      });
      modal.close();
      queryClient.invalidateQueries(["categories"] as any);
    },
    onError: (error) => {
      notifications.show({
        title: "Erreur",
        message: error.message,
        color: "red",
      });
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      notifications.show({
        title: "Supprimée",
        message: "Catégorie supprimée",
        color: "violet",
      });
      queryClient.invalidateQueries(["categories"] as any);
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
    createCategory({ variables: { input: { name: newName.trim() } } });
  };

  const handleEdit = (category: Category) => {
    setEditId(category.id);
    setEditName(category.name);
    modal.open();
  };

  const handleUpdate = () => {
    if (!editName.trim() || !editId) return;
    updateCategory({ variables: { id: editId, input: { name: editName.trim() } } });
  };

  const handleDelete = (category: Category) => {
    if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      deleteCategory({ variables: { id: category.id } });
    }
  };

  const categories = data?.categories ?? [];

  return (
    <Stack gap="lg">
      <Title order={2} c="white">
        Catégories
      </Title>

      {/* Create Form */}
      <Card padding="lg">
        <Group>
          <TextInput
            placeholder="Nouvelle catégorie..."
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

      {/* Categories Table */}
      <Card padding={0}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Scans</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((category) => (
              <Table.Tr key={category.id}>
                <Table.Td>
                  <Text fw={500} c="white">
                    {category.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="violet" size="sm">
                    {category._count?.scans ?? 0}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Menu withinPortal>
                    <Menu.Target>
                      <Button variant="contained" size="xs" rightSection={<IconChevronDown size={14} />}>
                        Actions
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleEdit(category)}
                      >
                        Modifier
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleDelete(category)}
                      >
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
            {categories.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text ta="center" c="dimmed" py="md">
                    Aucune catégorie
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
        title="Modifier la catégorie"
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
