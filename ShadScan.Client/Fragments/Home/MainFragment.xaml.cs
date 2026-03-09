using NAPS2.Images.Wpf;
using NAPS2.Scan;
using ShadScan.Client.Infrastructure;
using ShadScan.Client.Models;
using System.Windows;
using System.Windows.Controls;

namespace ShadScan.Client.Fragments.Home
{
    /// <summary>
    /// Logique d'interaction pour MainFragment.xaml
    /// </summary>
    public partial class MainFragment : UserControl
    {
        public MainFragment()
        {
            InitializeComponent();
            this.Loaded += MainFragment_Loaded;
        }

        private async void MainFragment_Loaded(object sender, RoutedEventArgs e)
        {
            using var scanningContext = new ScanningContext(new WpfImageContext());
            var devices = await ScannerInstance.GetInstance().GetScannersAsync();
            var scanCount = Instance.GetInstance().GetRepository<ScanItem>().List().Count;
            var res = await new GraphQLClient().GetStatsAsync();
            await Dispatcher.BeginInvoke(() =>
            {
                txtStats.Text =
                    $"Nombre de scanners trouvés = {devices.Count}{Environment.NewLine}Nombre de fichiers scannés = {scanCount}. Nombre de scans en ligne = {res.stats.TotalScans}";
            });
        }
    }
}
