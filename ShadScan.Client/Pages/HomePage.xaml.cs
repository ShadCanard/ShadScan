using ShadScan.Client.Fragments.Home;
using System.Windows.Controls;

namespace ShadScan.Client.Pages
{
    /// <summary>
    /// Logique d'interaction pour HomePage.xaml
    /// </summary>
    public partial class HomePage : Page
    {
        public HomePage()
        {
            InitializeComponent();
            ucMain.Content = Instance.GetInstance().GetFragment<MainFragment>();
        }
    }
}
