using ShadDev.Core.NET.UserControls;
using System.Windows.Controls;

namespace ShadScan.Client.Pages
{
    /// <summary>
    /// Logique d'interaction pour SettingsPage.xaml
    /// </summary>
    public partial class SettingsPage : Page
    {
        public SettingsPage()
        {
            InitializeComponent();
            ucMain.Content = Instance.GetInstance().GetFragment<SettingsMainFragment>();
        }
    }
}
