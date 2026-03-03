"use client";

import {
  createTheme,
  MantineColorsTuple,
  DEFAULT_THEME,
  mergeMantineTheme,
} from "@mantine/core";

const violet: MantineColorsTuple = [
  "#f3e8ff",
  "#e4cfff",
  "#c9a0fc",
  "#ad6ef9",
  "#9645f5",
  "#872df3",
  "#7f20f2",
  "#6c14d8",
  "#600ec2",
  "#5200ab",
];

const dark: MantineColorsTuple = [
  "#c9c9c9",
  "#b8b8b8",
  "#828282",
  "#696969",
  "#424242",
  "#3b3b3b",
  "#2e2e2e",
  "#242424",
  "#1f1f1f",
  "#141414",
];

const themeOverride = createTheme({
  primaryColor: "violet",
  colors: {
    violet,
    dark,
  },
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        variant: "filled",
      },
    },
    Card: {
      defaultProps: {
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: "var(--mantine-color-dark-7)",
          borderColor: "var(--mantine-color-dark-5)",
        },
      },
    },
    Modal: {
      styles: {
        content: {
          backgroundColor: "var(--mantine-color-dark-7)",
        },
        header: {
          backgroundColor: "var(--mantine-color-dark-7)",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: "var(--mantine-color-dark-7)",
        },
      },
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: "var(--mantine-color-dark-8)",
        },
        navbar: {
          backgroundColor: "var(--mantine-color-dark-7)",
          borderColor: "var(--mantine-color-dark-5)",
        },
        header: {
          backgroundColor: "var(--mantine-color-dark-7)",
          borderColor: "var(--mantine-color-dark-5)",
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: "var(--mantine-color-dark-6)",
          borderColor: "var(--mantine-color-dark-4)",
        },
      },
    },
    Select: {
      styles: {
        input: {
          backgroundColor: "var(--mantine-color-dark-6)",
          borderColor: "var(--mantine-color-dark-4)",
        },
      },
    },
    MultiSelect: {
      styles: {
        input: {
          backgroundColor: "var(--mantine-color-dark-6)",
          borderColor: "var(--mantine-color-dark-4)",
        },
      },
    },
    Textarea: {
      styles: {
        input: {
          backgroundColor: "var(--mantine-color-dark-6)",
          borderColor: "var(--mantine-color-dark-4)",
        },
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
