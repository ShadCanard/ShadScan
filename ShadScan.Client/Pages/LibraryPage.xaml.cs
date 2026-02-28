using ShadScan.Client.Fragments.Library;
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
