namespace ShadScan.Client.Models.GraphQL
{
    public enum ScanType
    {
        UNKNOWN,
        LETTER,
        PHOTO,
        DRAWING
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public List<Scan> Scans { get; set; }
        public CategoryCount _count { get; set; }
    }

    public class CategoryCount
    {
        public int Scans { get; set; }
    }

    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public List<Scan> Scans { get; set; }
    }

    public class ScanFile
    {
        public int Id { get; set; }
        public int Page { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string MimeType { get; set; }
        public int FileSize { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
    }

    public class Scan
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public ScanType Type { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public List<Tag> Tags { get; set; }
        public List<ScanFile> Files { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string ReceivedAt { get; set; }
    }

    public class PaginatedScans
    {
        public List<Scan> Scans { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class ScanTypeStat
    {
        public ScanType Type { get; set; }
        public int Count { get; set; }
    }

    public class Stats
    {
        public int TotalScans { get; set; }
        public int TotalCategories { get; set; }
        public int TotalTags { get; set; }
        public List<ScanTypeStat> ScansByType { get; set; }
    }

    #region Input DTOs

    public class CreateScanInput
    {
        public string Name { get; set; }
        public string Author { get; set; }
        public ScanType? Type { get; set; }
        public int CategoryId { get; set; }
        public List<int> TagIds { get; set; }
    }

    public class UpdateScanInput
    {
        public string Name { get; set; }
        public string Author { get; set; }
        public ScanType? Type { get; set; }
        public int? CategoryId { get; set; }
        public List<int> TagIds { get; set; }
        public string ReceivedAt { get; set; }
    }

    public class CreateCategoryInput
    {
        public string Name { get; set; }
    }

    public class UpdateCategoryInput
    {
        public string Name { get; set; }
    }

    public class CreateTagInput
    {
        public string Name { get; set; }
    }

    public class UpdateTagInput
    {
        public string Name { get; set; }
    }

    public class ScanFilterInput
    {
        public string Search { get; set; }
        public ScanType? Type { get; set; }
        public int? CategoryId { get; set; }
        public List<int> TagIds { get; set; }
        public string Author { get; set; }
    }

    #endregion
}