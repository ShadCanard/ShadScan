using Newtonsoft.Json;
using ShadDev.Core.NET.Infrastructure.Entities;

namespace ShadScan.Client.Models
{
    [Serializable]
    [FilePath(@"{DATA}\authors.json", FileType.Json)]
    public class ScanAuthor : FullyAuditedEntity<Guid>
    {
        [JsonProperty("name")]
        public string? Name { get; set; }
        [JsonProperty("description")]
        public string? Description { get; set; }

        public override bool GetByID(object ID)
        {
            return this.Id.Equals(Guid.Parse(ID.ToString()));
        }

        public override bool Search(string wordToSearch)
        {
            return
                Name.SafeContains(wordToSearch) ||
                Description.SafeContains(wordToSearch);
        }
    }
}
