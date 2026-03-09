using System.ComponentModel;

namespace ShadScan.Client.Models
{
    public enum ContentFilter
    {
        [Description("Aucun")]
        None = 0,
        [Description("Catégories")]
        Categories = 1,
        [Description("Fichiers")]
        Files = 2,
        [Description("Tags")]
        Tags = 3,
        [Description("Auteurs")]
        Authors = 4,
    }
}
