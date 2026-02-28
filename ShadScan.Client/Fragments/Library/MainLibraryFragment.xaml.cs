using System;
using System.Collections.Generic;
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
