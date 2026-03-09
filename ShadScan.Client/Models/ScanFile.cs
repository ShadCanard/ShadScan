using Newtonsoft.Json;

namespace ShadScan.Client.Models
{
    [Serializable]
    public class ScanFile
    {
        [JsonProperty("uploadedId")]
        public Guid uploadedId { get; set; }

        [JsonProperty("pageNumber")]
        public int PageNumber { get; set; }

        [JsonProperty("imagePath")]
        public string Path { get; set; }
    }
}
