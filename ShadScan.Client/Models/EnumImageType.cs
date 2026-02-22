using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

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
