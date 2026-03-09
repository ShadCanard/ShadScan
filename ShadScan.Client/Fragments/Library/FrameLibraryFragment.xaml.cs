using System.Windows.Controls;

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
