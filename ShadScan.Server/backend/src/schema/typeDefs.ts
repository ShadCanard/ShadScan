import gql from "graphql-tag";

export const typeDefs = gql`
  enum ScanType {
    UNKNOWN
    LETTER
    PHOTO
    DRAWING
  }

  type Category {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    scans: [Scan!]!
    _count: CategoryCount
  }

  type CategoryCount {
    scans: Int!
  }

  type Tag {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    scans: [Scan!]!
  }

  type ScanFile {
    id: Int!
    page: Int!
    filePath: String!
    fileName: String!
    mimeType: String!
    fileSize: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Scan {
    id: Int!
    name: String!
    author: String!
    type: ScanType!
    categoryId: Int!
    category: Category!
    tags: [Tag!]!
    files: [ScanFile!]!     # associated files
    createdAt: String!
    updatedAt: String!
    receivedAt: String!
  }

  type PaginatedScans {
    scans: [Scan!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input CreateScanInput {
    name: String!
    author: String!
    type: ScanType
    categoryId: Int!
    tagIds: [Int!]
  }

  input UpdateScanInput {
    name: String
    author: String
    type: ScanType
    categoryId: Int
    tagIds: [Int!]
    receivedAt: String
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String!
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String!
  }

  input ScanFilterInput {
    search: String
    type: ScanType
    categoryId: Int
    tagIds: [Int!]
    author: String
  }

  type Query {
    # Scans
    scans(page: Int, pageSize: Int, filter: ScanFilterInput): PaginatedScans!
    scan(id: Int!): Scan

    # Scan files
    scanFile(id: Int!): ScanFile
    scanFiles(scanId: Int!): [ScanFile!]!

    # Categories
    categories: [Category!]!
    category(id: Int!): Category

    # Tags
    tags: [Tag!]!
    tag(id: Int!): Tag

    # Stats
    stats: Stats!

    # Authors for autocompletion
    authors: [String!]!
  }

  type Stats {
    totalScans: Int!
    totalCategories: Int!
    totalTags: Int!
    scansByType: [ScanTypeStat!]!
  }

  type ScanTypeStat {
    type: ScanType!
    count: Int!
  }

  type Mutation {
    # Scans
    createScan(input: CreateScanInput!): Scan!
    updateScan(id: Int!, input: UpdateScanInput!): Scan!
    deleteScan(id: Int!): Boolean!

    # Scan files
    addScanFile(
      scanId: Int!
      filePath: String!
      fileName: String!
      mimeType: String!
      fileSize: Int!
    ): ScanFile!
    deleteScanFile(id: Int!): Boolean!

    # Categories
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: Int!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: Int!): Boolean!

    # Tags
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: Int!, input: UpdateTagInput!): Tag!
    deleteTag(id: Int!): Boolean!
  }
`;
