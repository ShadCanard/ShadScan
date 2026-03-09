using System.Windows.Controls;

namespace ShadScan.Client.Fragments.Library
{
    /// <summary>
    /// Logique d'interaction pour MainLibraryFragment.xaml
    /// </summary>
    public partial class MainLibraryFragment : UserControl
    {
        public MainLibraryFragment()
        {
            InitializeComponent();
            SetMenuContent<MenuLibraryFragment>();
        }

        public void SetMainContent<T>(params object[] args) where T : UserControl
        {
            ucMain.Content = Instance.GetInstance().GetFragment<T>(args);
        }

        public void SetMenuContent<T>(params object[] args) where T : UserControl
        {
            ucMenu.Content = Instance.GetInstance().GetFragment<T>(args);
        }
    }
}
