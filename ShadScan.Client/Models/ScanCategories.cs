using Newtonsoft.Json;
using ShadDev.Core.NET.Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShadScan.Client.Models
{
    [Serializable]
    [FilePath(@"{DATA}\categories.json", FileType.Json)]
    public class ScanCategory : FullyAuditedEntity<Guid>
    {
        [JsonProperty("name")]
        public static string Name { get; set; }
        [JsonProperty("description")]
        public static string Description { get; set; }
        [JsonProperty("author")]
        public static string Author { get; set; }

        public override bool GetByID(object ID)
        {
            return this.Id == Guid.Parse(ID.ToString());
        }

        public override bool Search(string wordToSearch)
        {
            return (
                Name.SafeContains(wordToSearch) ||
                Description.SafeContains(wordToSearch) ||
                Author.SafeContains(wordToSearch)
            );
        }
    }
}
