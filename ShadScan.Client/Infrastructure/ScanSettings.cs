using Newtonsoft.Json;
using ShadDev.Core.NET.Infrastructure;
using ShadDev.Core.NET.Infrastructure.Attributes;
using ShadDev.Core.NET.UserControls;
using System.ComponentModel;

namespace ShadScan.Client.Infrastructure
{
    [Serializable]
    [FilePath(@"{DATA}\settings.json", FileType.Json)]
    public class ScanSettings : AppSettings
    {
        [JsonProperty("defaultScanFolder")]
        [Settings(typeof(BrowseFolder), MaxWidth: 200)]
        [Description("Dossier de scan par défaut")]

        public string DefaultFolder { get; set; } = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
    }
}
