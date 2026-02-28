using ShadScan.Client.Infrastructure;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ShadScan.Client.Fragments.Scan
{
    /// <summary>
    /// Logique d'interaction pour MenuScanFragment.xaml
    /// </summary>
    public partial class MenuScanFragment : UserControl
    {
        public MenuScanFragment()
        {
            InitializeComponent();
            this.Loaded += OnLoadMenu;
        }

        private async void OnLoadMenu(object sender, RoutedEventArgs e)
        {
            this.cbScanners.ItemsSource = await ScannerInstance.GetInstance().GetScannersAsync();
        }

        private void OnPreviewScan(object sender, RoutedEventArgs e)
        {
            Instance.GetInstance().GetFragment<MainScanFragment>().SetMainContent<ResultScanFragment>();
            Instance.GetInstance().GetFragment<ResultScanFragment>().LaunchPreviewScan();
        }
    }
}
