"use client";

import {
  Modal,
  Image,
  Stack,
  Group,
  Text,
  Badge,
  Divider,
  Button,
  Box,
} from "@mantine/core";
import type { Scan } from "@/types";
import { SCAN_TYPE_LABELS } from "@/types";
import { getScanImageUrl, formatFileSize, formatDate, formatDateOnly } from "@/lib/utils";
import { IconArrowUpRight } from "@tabler/icons-react";

interface ScanViewModalProps {
  scan: Scan;
  opened: boolean;
  onClose: () => void;
}

export default function ScanViewModal({
  scan,
  opened,
  onClose,
}: ScanViewModalProps) {
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      // custom title so we can include a button that opens the image in a new tab
      title={
        <Group gap="xs" align="center" style={{ width: '100%' }}>
          <Box flex={1}>
            <Text>{scan.name}</Text>
          </Box>
          <a
            href={getScanImageUrl(scan.filePath)}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="xs" variant="subtle" color="green">
              <IconArrowUpRight size={16} />
            </Button>
          </a>
        </Group>
      }
      size="xl"
    >
      <Stack>
        {scan.mimeType === "application/pdf" ? (
          <Box style={{ width: "100%", height: 500 }}>
            <object
              data={getScanImageUrl(scan.filePath)}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <Text>Votre navigateur ne supporte pas l&apos;affichage des PDF.</Text>
            </object>
          </Box>
        ) : (
          <Image
            src={getScanImageUrl(scan.filePath)}
            alt={scan.name}
            mah={500}
            fit="contain"
            radius="md"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJlMmUyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjk2OTY5IiBmb250LXNpemU9IjE2Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4="
          />
        )}

        <Divider color="dark.5" />

        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Type</Text>
            <Badge variant="filled" color="violet">
              {SCAN_TYPE_LABELS[scan.type]}
            </Badge>
          </div>
          <div>
            <Text size="xs" c="dimmed">Catégorie</Text>
            <Badge variant="light" color="grape">
              {scan.category.name}
            </Badge>
          </div>
          <div>
            <Text size="xs" c="dimmed">Taille</Text>
            <Text size="sm" c="white">{formatFileSize(scan.fileSize)}</Text>
          </div>
        </Group>

        <div>
          <Text size="xs" c="dimmed">Auteur</Text>
          <Text size="sm" c="white">{scan.author}</Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">Fichier original</Text>
          <Text size="sm" c="white">{scan.fileName}</Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">Reçu le</Text>
          <Text size="sm" c="white">{formatDateOnly(scan.receivedAt)}</Text>
        </div>

        {scan.tags.length > 0 && (
          <div>
            <Text size="xs" c="dimmed" mb={4}>Tags</Text>
            <Group gap={4}>
              {scan.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" color="violet" size="sm">
                  {tag.name}
                </Badge>
              ))}
            </Group>
          </div>
        )}

        {scan.linkedScans.length > 0 && (
          <div>
            <Text size="xs" c="dimmed" mb={4}>Scans liés</Text>
            <Group gap={4}>
              {scan.linkedScans.map((s) => (
                <Badge key={s.id} variant="outline" color="grape" size="sm">
                  {s.name}
                </Badge>
              ))}
            </Group>
          </div>
        )}

        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Créé le</Text>
            <Text size="xs" c="white">{formatDate(scan.createdAt)}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Modifié le</Text>
            <Text size="xs" c="white">{formatDate(scan.updatedAt)}</Text>
          </div>
        </Group>
      </Stack>
    </Modal>
  );
}
