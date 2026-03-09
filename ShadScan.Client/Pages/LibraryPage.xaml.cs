using ShadScan.Client.Fragments.Library;
using System.Windows.Controls;

namespace ShadScan.Client.Pages
{
    /// <summary>
    /// Logique d'interaction pour LibraryPage.xaml
    /// </summary>
    public partial class LibraryPage : Page
    {
        public LibraryPage()
        {
            InitializeComponent();
            ucMain.Content = Instance.GetInstance().GetFragment<FrameLibraryFragment>();
        }
    }
}
