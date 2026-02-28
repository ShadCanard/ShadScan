using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using Windows.ApplicationModel.Background;

namespace ShadScan.Client.Models
{
    [Serializable]
    public class ScanFile
    {
        [JsonProperty("pageNumber")]
        public int PageNumber { get; set; }

        [JsonProperty("imagePath")]
        public string Path { get; set; }
    }
}
