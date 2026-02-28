using Newtonsoft.Json;
using ShadDev.Core.NET.Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Text.Json.Serialization;
using System.Windows.Media.Imaging;
using JsonIgnoreAttribute = Newtonsoft.Json.JsonIgnoreAttribute;

namespace ShadScan.Client.Models
{
    [Serializable]
    [FilePath(@"{DATA}\scans.json", FileType.Json)]
    public class ScanItem : FullyAuditedEntity<Guid>
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("type")]
        public ImageType Type { get; set; } = ImageType.UNKNOWN;

        [JsonProperty("files")]
        public List<ScanFile> Files { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }

        [JsonProperty("authorId")]
        private Guid AuthorId { get; set; }

        [JsonIgnore]
        public ScanAuthor? Author
        {
            get
            {
                if (AuthorId == Guid.Empty) return null;
                return Instance.GetInstance().GetRepository<ScanAuthor>().ByID(AuthorId);
            }
            set
            {
                if (value != null)
                {
                    AuthorId = value.Id;
                }
            }
        }

        [JsonProperty("categoryId")]
        private Guid CategoryId { get; set; }

        [JsonIgnore]
        public ScanCategory? Category
        {
            get
            {
                if (CategoryId == Guid.Empty) return null;
                return Instance.GetInstance().GetRepository<ScanCategory>().ByID(CategoryId);
            }
            set
            {
                if (value != null)
                {
                    CategoryId = value.Id;
                }
            }
        }

        [JsonIgnore]
        public BitmapImage? Image
        {
            get
            {
                return Files.FirstOrDefault()?.Path.LoadImageFromFile();
            }
        }

        [JsonIgnore]
        public bool HasMultipleFiles => Files != null && Files.Count > 1;

        public override bool GetByID(object ID)
        {
            return this.Id.ToString() == ID.ToString();
        }

        public override bool Search(string wordToSearch)
        {
            return (
                Name.SafeContains(wordToSearch) ||
                Description.SafeContains(wordToSearch) ||
                Type.SafeContains(wordToSearch) ||
                Files.Select(f => f.Path).SafeContains(wordToSearch)
            );
        }
    }
}
