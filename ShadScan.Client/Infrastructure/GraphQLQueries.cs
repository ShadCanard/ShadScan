namespace ShadScan.Client.Infrastructure
{
    public static class GraphQLQueries
    {
        // ============== SCAN QUERIES ==============

        public static string GetScans = @"
query GetScans($page: Int, $pageSize: Int, $filter: ScanFilterInput) {
  scans(page: $page, pageSize: $pageSize, filter: $filter) {
    scans {
      id
      name
      author
      type
      categoryId
      category {
        id
        name
      }
      tags {
        id
        name
      }
      files {
        id
        page
        filePath
        fileName
        mimeType
        fileSize
      }
      receivedAt
      createdAt
      updatedAt
    }
    total
    page
    pageSize
    totalPages
  }
}
";

        public static string GetScan = @"
query GetScan($id: Int!) {
  scan(id: $id) {
    id
    name
    author
    type
    filePath
    fileName
    mimeType
    fileSize
    categoryId
    category {
      id
      name
    }
    tags {
      id
      name
    }
    files {
      id
      page
      filePath
      fileName
      mimeType
      fileSize
    }
    receivedAt
    createdAt
    updatedAt
  }
}
";

        // ============== SCAN LIST QUERY ==============

        public static string GetScanFiles = @"
query GetScanFiles($scanId: Int!) {
  scanFiles(scanId: $scanId) {
    id
    filePath
    fileName
    mimeType
    fileSize
  }
}
";

        public static string GetScanList = @"
query GetScanList {
  scans(page: 1, pageSize: 1000) {
    scans {
      id
      name
    }
  }
}
";

        // ============== CATEGORY QUERIES ==============

        public static string GetCategories = @"
query GetCategories {
  categories {
    id
    name
    _count {
      scans
    }
    createdAt
  }
}
";

        // ============== TAG QUERIES ==============

        public static string GetTags = @"
query GetTags {
  tags {
    id
    name
    createdAt
  }
}
";

        // ============== STATS QUERIES ==============

        public static string GetStats = @"
query GetStats {
  stats {
    totalScans
    totalCategories
    totalTags
    scansByType {
      type
      count
    }
  }
}
";

        // ============== SCAN MUTATIONS ==============

        public static string CreateScan = @"
mutation CreateScan($input: CreateScanInput!) {
  createScan(input: $input) {
    id
    name
    author
    type
    filePath
    fileName
    category {
      id
      name
    }
    tags {
      id
      name
    }
    files {
      id
      filePath
    }
    receivedAt
  }
}
";

        public static string UpdateScan = @"
mutation UpdateScan($id: Int!, $input: UpdateScanInput!) {
  updateScan(id: $id, input: $input) {
    id
    name
    author
    type
    categoryId
    category {
      id
      name
    }
    tags {
      id
      name
    }
    receivedAt
  }
}
";

        public static string DeleteScan = @"
mutation DeleteScan($id: Int!) {
  deleteScan(id: $id)
}
";

        public static string AddScanFile = @"
mutation AddScanFile(
  $scanId: Int!
  $filePath: String!
  $fileName: String!
  $mimeType: String!
  $fileSize: Int!
) {
  addScanFile(
    scanId: $scanId
    filePath: $filePath
    fileName: $fileName
    mimeType: $mimeType
    fileSize: $fileSize
  ) {
    id
    filePath
    fileName
    mimeType
    fileSize
  }
}
";

        public static string DeleteScanFile = @"
mutation DeleteScanFile($id: Int!) {
  deleteScanFile(id: $id)
}
";

        // ============== CATEGORY MUTATIONS ==============

        public static string CreateCategory = @"
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    name
  }
}
";

        public static string UpdateCategory = @"
mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
  updateCategory(id: $id, input: $input) {
    id
    name
  }
}
";

        public static string DeleteCategory = @"
mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id)
}
";

        // ============== TAG MUTATIONS ==============

        public static string CreateTag = @"
mutation CreateTag($input: CreateTagInput!) {
  createTag(input: $input) {
    id
    name
  }
}
";

        public static string UpdateTag = @"
mutation UpdateTag($id: Int!, $input: UpdateTagInput!) {
  updateTag(id: $id, input: $input) {
    id
    name
  }
}
";

        public static string DeleteTag = @"
mutation DeleteTag($id: Int!) {
  deleteTag(id: $id)
}
";
    }
}