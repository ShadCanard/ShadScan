using System.ComponentModel;

namespace ShadScan.Client.Models
{
    public enum ImageType
    {
        [Description("Inconnu")]
        UNKNOWN = 0,
        [Description("Lettre")]
        LETTER = 1,
        [Description("Photo")]
        PHOTO = 2,
        [Description("Dessin")]
        DRAWING = 3
    }
}
