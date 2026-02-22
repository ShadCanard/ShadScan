using Newtonsoft.Json;
using ShadDev.Core.NET.Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
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

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("tags")]
        public string[] Tags { get; set; }

        [JsonProperty("categoryId")]
        public Guid CategoryId { get; set; }

        [JsonIgnore]
        public ScanCategory Category
        {
            get
            {
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
                Path.SafeContains(wordToSearch)
            );
        }
    }
}
