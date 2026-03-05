import { Prisma, ScanType } from "@prisma/client";
import prisma from "../prisma";
import fs from "fs";
import path from "path";

const scanInclude = {
  category: true,
  tags: true,
  files: true,
};

// Prisma returns Date objects, but to avoid clients receiving numeric timestamps
// we convert relevant fields to ISO strings before sending them over GraphQL.
function normalizeScanDates(scan: any): any {
  if (!scan) return scan;
  ["receivedAt", "createdAt", "updatedAt"].forEach((field) => {
    const val = scan[field];
    if (val instanceof Date) {
      scan[field] = val.toISOString();
    }
  });
  if (scan.files && Array.isArray(scan.files)) {
    // ensure deterministic order by page
    scan.files = scan.files
      .slice()
      .sort((a: any, b: any) => (a.page || 0) - (b.page || 0))
      .map((file: any) => {
        ["createdAt", "updatedAt"].forEach((f) => {
          const val = file[f];
          if (val instanceof Date) {
            file[f] = val.toISOString();
          }
        });
        return file;
      });
  }
  return scan;
}

export const resolvers = {
  Query: {
    scans: async (
      _: unknown,
      args: {
        page?: number;
        pageSize?: number;
        filter?: {
          search?: string;
          type?: ScanType;
          categoryId?: number;
          tagIds?: number[];
          author?: string;
        };
      }
    ) => {
      const page = args.page ?? 1;
      const pageSize = args.pageSize ?? 20;
      const skip = (page - 1) * pageSize;

      const where: Prisma.ScanWhereInput = {};

      if (args.filter) {
        if (args.filter.search) {
          where.OR = [
            { name: { contains: args.filter.search } },
            { author: { contains: args.filter.search } },
          ];
        }
        if (args.filter.type) {
          where.type = args.filter.type;
        }
        if (args.filter.categoryId) {
          where.categoryId = args.filter.categoryId;
        }
        if (args.filter.author) {
          where.author = { contains: args.filter.author };
        }
        if (args.filter.tagIds && args.filter.tagIds.length > 0) {
          where.tags = {
            some: {
              id: { in: args.filter.tagIds },
            },
          };
        }
      }

      const [scans, total] = await Promise.all([
        prisma.scan.findMany({
          where,
          include: scanInclude,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.scan.count({ where }),
      ]);

      return {
        scans: scans.map(normalizeScanDates),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },

    scan: async (_: unknown, args: { id: number }) => {
      const scan = await prisma.scan.findUnique({
        where: { id: args.id },
        include: scanInclude,
      });
      return normalizeScanDates(scan);
    },

    categories: async () => {
      return prisma.category.findMany({
        include: { _count: { select: { scans: true } } },
        orderBy: { name: "asc" },
      });
    },

    category: async (_: unknown, args: { id: number }) => {
      return prisma.category.findUnique({
        where: { id: args.id },
        include: { scans: { include: scanInclude } },
      });
    },

    tags: async () => {
      return prisma.tag.findMany({
        orderBy: { name: "asc" },
      });
    },

    tag: async (_: unknown, args: { id: number }) => {
      return prisma.tag.findUnique({
        where: { id: args.id },
        include: { scans: { include: scanInclude } },
      });
    },

    scanFile: async (_: unknown, args: { id: number }) => {
      return prisma.scanFile.findUnique({ where: { id: args.id } });
    },

    scanFiles: async (_: unknown, args: { scanId: number }) => {
      return prisma.scanFile.findMany({
        where: { scanId: args.scanId },
        orderBy: { createdAt: "desc" },
      });
    },

    stats: async () => {
      const [totalScans, totalCategories, totalTags, scansByType] =
        await Promise.all([
          prisma.scan.count(),
          prisma.category.count(),
          prisma.tag.count(),
          prisma.scan.groupBy({
            by: ["type"],
            _count: { type: true },
          }),
        ]);

      return {
        totalScans,
        totalCategories,
        totalTags,
        scansByType: scansByType.map((s) => ({
          type: s.type,
          count: s._count.type,
        })),
      };
    },
  },

  Mutation: {
    createScan: async (
      _: unknown,
      args: {
        input: {
          name: string;
          author: string;
          type?: ScanType;
          categoryId: number;
          tagIds?: number[];
          receivedAt?: string;
          filePath: string;
          fileName: string;
          mimeType: string;
          fileSize: number;
        };
      }
    ) => {
      const { tagIds, receivedAt, filePath, fileName, mimeType, fileSize, ...data } = args.input;

      const created = await prisma.scan.create({
        data: {
          ...data,
          type: data.type ?? "UNKNOWN",
          tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
          receivedAt: receivedAt ? new Date(receivedAt) : undefined,
          files: {
            create: {
              filePath,
              fileName,
              mimeType,
              fileSize,
            },
          },
        },
        include: scanInclude,
      });
      return normalizeScanDates(created);
    },

    addScanFile: async (
      _: unknown,
      args: {
        scanId: number;
        filePath: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
      }
    ) => {
      // compute next page number
      const maxPage = await prisma.scanFile.aggregate({
        where: { scanId: args.scanId },
        _max: { page: true },
      });
      const nextPage = (maxPage._max.page ?? 0) + 1;
      const file = await prisma.scanFile.create({
        data: {
          scanId: args.scanId,
          page: nextPage,
          filePath: args.filePath,
          fileName: args.fileName,
          mimeType: args.mimeType,
          fileSize: args.fileSize,
        },
      });
      return file;
    },

    deleteScanFile: async (_: unknown, args: { id: number }) => {
      const file = await prisma.scanFile.findUnique({ where: { id: args.id } });
      if (file) {
        const fullPath = path.resolve(file.filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        await prisma.scanFile.delete({ where: { id: args.id } });
      }
      return true;
    },


    updateScan: async (
      _: unknown,
      args: {
        id: number;
        input: {
          name?: string;
          author?: string;
          type?: ScanType;
          categoryId?: number;
          tagIds?: number[];
          receivedAt?: string;
        };
      }
    ) => {
      const { tagIds, receivedAt, ...data } = args.input;

      const updated = await prisma.scan.update({
        where: { id: args.id },
        data: {
          ...data,
          tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
          receivedAt: receivedAt ? new Date(receivedAt) : undefined,
        },
        include: scanInclude,
      });
      return normalizeScanDates(updated);
    },

    deleteScan: async (_: unknown, args: { id: number }) => {
      const scan = await prisma.scan.findUnique({
        where: { id: args.id },
        include: { files: true },
      });
      if (scan) {
        // remove physical files first
        for (const f of scan.files) {
          const fullPath = path.resolve(f.filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }

        // delete any scanFile records (relation is RESTRICT)
        await prisma.scanFile.deleteMany({ where: { scanId: args.id } });
        await prisma.scan.delete({ where: { id: args.id } });
      }
      return true;
    },

    createCategory: async (
      _: unknown,
      args: { input: { name: string } }
    ) => {
      return prisma.category.create({
        data: args.input,
        include: { _count: { select: { scans: true } } },
      });
    },

    updateCategory: async (
      _: unknown,
      args: { id: number; input: { name: string } }
    ) => {
      return prisma.category.update({
        where: { id: args.id },
        data: args.input,
        include: { _count: { select: { scans: true } } },
      });
    },

    deleteCategory: async (_: unknown, args: { id: number }) => {
      await prisma.category.delete({ where: { id: args.id } });
      return true;
    },

    createTag: async (_: unknown, args: { input: { name: string } }) => {
      return prisma.tag.create({ data: args.input });
    },

    updateTag: async (
      _: unknown,
      args: { id: number; input: { name: string } }
    ) => {
      return prisma.tag.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteTag: async (_: unknown, args: { id: number }) => {
      await prisma.tag.delete({ where: { id: args.id } });
      return true;
    },
  },
};
