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
    /// Logique d'interaction pour FrameLibraryFragment.xaml
    /// </summary>
    public partial class FrameLibraryFragment : UserControl
    {
        public FrameLibraryFragment()
        {
            InitializeComponent();
            SetContent<MainLibraryFragment>();
        }

        public void SetContent<T>(params object[] args) where T : UserControl
        {
            Content = Instance.GetInstance().GetFragment<T>(args);
        }

        public void SetContent(string name)
        {
            Content = Instance.GetInstance().GetStackRepository().Find(name);
        }

        public void SetContent(Guid id)
        {
            Content = Instance.GetInstance().GetStackRepository().Find(id);
        }
    }
}
