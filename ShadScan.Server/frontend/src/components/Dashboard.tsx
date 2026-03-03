"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlQuery } from "@/lib/graphql-client";
import {
  SimpleGrid,
  Card,
  Text,
  Group,
  ThemeIcon,
  RingProgress,
  Stack,
  Title,
  Skeleton,
  Center,
  Paper,
} from "@mantine/core";
import {
  IconScan,
  IconCategory,
  IconTags,
  IconPhoto,
  IconMail,
  IconPencil,
  IconQuestionMark,
} from "@tabler/icons-react";
import { GET_STATS } from "@/lib/graphql/queries";
import type { Stats, ScanType } from "@/types";

const typeIcons: Record<string, typeof IconScan> = {
  PHOTO: IconPhoto,
  LETTER: IconMail,
  DRAWING: IconPencil,
  UNKNOWN: IconQuestionMark,
};

const typeColors: Record<string, string> = {
  PHOTO: "violet",
  LETTER: "indigo",
  DRAWING: "grape",
  UNKNOWN: "gray",
};

const typeLabels: Record<string, string> = {
  PHOTO: "Photos",
  LETTER: "Lettres",
  DRAWING: "Dessins",
  UNKNOWN: "Inconnus",
};

export default function Dashboard() {
  const { data, isLoading: loading } = useQuery<{ stats: Stats }, Error>({
    queryKey: ["stats"],
    queryFn: () => graphqlQuery<{ stats: Stats }>(GET_STATS),
  });

  if (loading) {
    return (
      <Stack>
        <Title order={2} c="white">Tableau de bord</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={120} radius="md" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  const stats = data?.stats;
  const totalByType = stats?.scansByType ?? [];
  const total = stats?.totalScans ?? 0;

  return (
    <Stack gap="lg">
      <Title order={2} c="white">
        Tableau de bord
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <Card padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Scans
              </Text>
              <Text size="xl" fw={700} c="white" mt={4}>
                {stats?.totalScans ?? 0}
              </Text>
            </div>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: "violet.7", to: "violet.4" }} radius="md">
              <IconScan size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Catégories
              </Text>
              <Text size="xl" fw={700} c="white" mt={4}>
                {stats?.totalCategories ?? 0}
              </Text>
            </div>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: "grape.7", to: "grape.4" }} radius="md">
              <IconCategory size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Tags
              </Text>
              <Text size="xl" fw={700} c="white" mt={4}>
                {stats?.totalTags ?? 0}
              </Text>
            </div>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: "indigo.7", to: "indigo.4" }} radius="md">
              <IconTags size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Types
              </Text>
              <Text size="xl" fw={700} c="white" mt={4}>
                {totalByType.length}
              </Text>
            </div>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: "violet.9", to: "violet.6" }} radius="md">
              <IconPhoto size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {totalByType.length > 0 && (
        <Card padding="lg">
          <Text size="sm" fw={700} c="dimmed" tt="uppercase" mb="md">
            Répartition par type
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            {totalByType.map((item) => {
              const Icon = typeIcons[item.type] || IconQuestionMark;
              const color = typeColors[item.type] || "gray";
              const label = typeLabels[item.type] || item.type;
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

              return (
                <Paper key={item.type} p="md" withBorder style={{ borderColor: "var(--mantine-color-dark-5)" }}>
                  <Group>
                    <RingProgress
                      size={64}
                      thickness={6}
                      roundCaps
                      sections={[{ value: percentage, color }]}
                      label={
                        <Center>
                          <Icon size={18} />
                        </Center>
                      }
                    />
                    <div>
                      <Text size="lg" fw={700} c="white">
                        {item.count}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {label} ({percentage}%)
                      </Text>
                    </div>
                  </Group>
                </Paper>
              );
            })}
          </SimpleGrid>
        </Card>
      )}
    </Stack>
  );
}
