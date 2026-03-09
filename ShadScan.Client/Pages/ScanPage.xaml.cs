using ShadScan.Client.Fragments.Scan;
using System.Windows.Controls;

namespace ShadScan.Client.Pages
{
    /// <summary>
    /// Logique d'interaction pour ScanPage.xaml
    /// </summary>
    public partial class ScanPage : Page
    {
        public ScanPage()
        {
            InitializeComponent();
            ucMain.Content = Instance.GetInstance().GetFragment<MainScanFragment>();
        }
    }
}
