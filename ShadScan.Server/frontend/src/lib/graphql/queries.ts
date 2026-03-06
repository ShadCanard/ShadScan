import { gql } from "@apollo/client";

// ============== SCAN QUERIES ==============

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors
  }
`;


export const GET_SCANS = gql`
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
`;

export const GET_SCAN = gql`
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
`;

// ============== SCAN LIST QUERY ==============

export const GET_SCAN_FILES = gql`
  query GetScanFiles($scanId: Int!) {
    scanFiles(scanId: $scanId) {
      id
      filePath
      fileName
      mimeType
      fileSize
      createdAt
    }
  }
`;

export const GET_SCAN_LIST = gql`
  query GetScanList {
    scans(page: 1, pageSize: 1000) {
      scans {
        id
        name
      }
    }
  }
`;

// ============== CATEGORY QUERIES ==============

export const GET_CATEGORIES = gql`
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
`;

// ============== TAG QUERIES ==============

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      createdAt
    }
  }
`;

// ============== STATS QUERIES ==============

export const GET_STATS = gql`
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
`;

// ============== SCAN MUTATIONS ==============

export const CREATE_SCAN = gql`
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
`;

export const UPDATE_SCAN = gql`
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
`;

export const DELETE_SCAN = gql`
  mutation DeleteScan($id: Int!) {
    deleteScan(id: $id)
  }
`;

export const ADD_SCAN_FILE = gql`
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
`;

export const DELETE_SCAN_FILE = gql`
  mutation DeleteScanFile($id: Int!) {
    deleteScanFile(id: $id)
  }
`;

// ============== CATEGORY MUTATIONS ==============

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

// ============== TAG MUTATIONS ==============

export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: Int!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id)
  }
`;
