import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import prisma from "./prisma";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const PORT = parseInt(process.env.PORT || "4000", 10);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/tiff",
      "image/bmp",
      "application/pdf",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté: ${file.mimetype}`));
    }
  },
});

async function startServer() {
  const app = express();

  // CORS configuration - allow local development
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    })
  );

  // Static files - serve uploaded images
  app.use("/uploads", express.static(path.resolve(UPLOAD_DIR)));

  // REST endpoint for file upload (used by desktop client)
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
      }

      const { name, author, type, categoryId, tagIds, scanId, receivedAt } = req.body;

      // if a scanId is provided we attach the file instead of creating a new scan
      if (scanId) {
        const sid = parseInt(scanId, 10);
        if (isNaN(sid)) {
          res.status(400).json({ error: "scanId invalide" });
          return;
        }
        // ensure scan exists
        const existing = await prisma.scan.findUnique({
          where: { id: sid },
          include: { files: true },
        });
        if (!existing) {
          res.status(404).json({ error: "Scan introuvable" });
          return;
        }
        // determine page number
        const maxPageRes = await prisma.scanFile.aggregate({
          where: { scanId: sid },
          _max: { page: true },
        });
        const nextPage = (maxPageRes._max.page ?? 0) + 1;
        const fileRec = await prisma.scanFile.create({
          data: {
            scanId: sid,
            page: nextPage,
            filePath: req.file.path.replace(/\\/g, "/"),
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
          },
        });
        // return updated scan
        const updated = await prisma.scan.findUnique({
          where: { id: sid },
          include: { files: true },
        });
        res.status(201).json(updated);
        return;
      }

      // otherwise create a new scan as before
      if (!name || !author || !categoryId) {
        res.status(400).json({
          error: "Les champs name, author et categoryId sont requis",
        });
        return;
      }

      const parsedTagIds = tagIds ? JSON.parse(tagIds) : [];

      const scan = await prisma.scan.create({
        data: {
          name,
          author,
          type: type || "UNKNOWN",
          categoryId: parseInt(categoryId, 10),
          receivedAt: receivedAt ? new Date(receivedAt) : undefined,
          tags: parsedTagIds.length
            ? { connect: parsedTagIds.map((id: number) => ({ id })) }
            : undefined,
          files: {
            create: {
              filePath: req.file.path.replace(/\\/g, "/"),
              fileName: req.file.originalname,
              mimeType: req.file.mimetype,
              fileSize: req.file.size,
            },
          },
        },
        include: {
          category: true,
          tags: true,
          files: true,
        },
      });

      res.status(201).json(scan);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Erreur lors du téléchargement" });
    }
  });

  // REST endpoint for bulk upload
  app.post("/api/upload/bulk", upload.array("files", 20), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
      }

      const { author, categoryId, type } = req.body;

      if (!author || !categoryId) {
        res.status(400).json({
          error: "Les champs author et categoryId sont requis",
        });
        return;
      }


      const scans = await Promise.all(
        files.map((file) =>
          prisma.scan.create({
            data: {
              name: path.parse(file.originalname).name,
              author,
              type: type || "UNKNOWN",
              categoryId: parseInt(categoryId, 10),
              files: {
                create: {
                  filePath: file.path.replace(/\\/g, "/"),
                  fileName: file.originalname,
                  mimeType: file.mimetype,
                  fileSize: file.size,
                },
              },
            },
            include: {
              category: true,
              tags: true,
              files: true,
            },
          })
        )
      );

      res.status(201).json(scans);
    } catch (error) {
      console.error("Bulk upload error:", error);
      res.status(500).json({ error: "Erreur lors du téléchargement groupé" });
    }
  });

  // Apollo Server setup (local only, no redirects)
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: async () => ({ prisma }),
    }) as unknown as express.RequestHandler
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads`);
    console.log(`🔍 Prisma Studio: run "npm run prisma:studio"`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
