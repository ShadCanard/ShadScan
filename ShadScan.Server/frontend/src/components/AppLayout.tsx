"use client";

import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Title,
  ThemeIcon,
  Stack,
  Divider,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconScan,
  IconDashboard,
  IconUpload,
  IconCategory,
  IconTags,
  IconPhoto,
} from "@tabler/icons-react";

type View = "dashboard" | "scans" | "upload" | "categories" | "tags";

interface AppLayoutProps {
  children: (activeView: View) => React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const [activeView, setActiveView] = useState<View>("dashboard");

  const navItems: { label: string; icon: typeof IconDashboard; view: View }[] = [
    { label: "Tableau de bord", icon: IconDashboard, view: "dashboard" },
    { label: "Scans", icon: IconScan, view: "scans" },
    { label: "Importer", icon: IconUpload, view: "upload" },
    { label: "Catégories", icon: IconCategory, view: "categories" },
    { label: "Tags", icon: IconTags, view: "tags" },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: "violet.7", to: "violet.4" }}>
              <IconPhoto size={20} />
            </ThemeIcon>
            <Title order={3} c="white">
              Scan Manager
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={4}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">
            Navigation
          </Text>
          {navItems.map((item) => (
            <NavLink
              key={item.view}
              label={item.label}
              leftSection={
                <ThemeIcon variant={activeView === item.view ? "filled" : "subtle"} color="violet" size="sm">
                  <item.icon size={16} />
                </ThemeIcon>
              }
              active={activeView === item.view}
              onClick={() => {
                setActiveView(item.view);
                if (opened) toggle();
              }}
              style={{
                borderRadius: "var(--mantine-radius-md)",
              }}
              color="violet"
            />
          ))}
        </Stack>

        <Box mt="auto" pt="md">
          <Divider mb="sm" color="dark.5" />
          <Text size="xs" c="dimmed" ta="center">
            Scan Manager v1.0
          </Text>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children(activeView)}</AppShell.Main>
    </AppShell>
  );
}
