using System.Windows.Controls;

namespace ShadScan.Client.Fragments.Scan
{
    /// <summary>
    /// Logique d'interaction pour MainScanFragment.xaml
    /// </summary>
    public partial class MainScanFragment : UserControl
    {
        public MainScanFragment()
        {
            InitializeComponent();
            SetMenuContent<MenuScanFragment>();
        }

        /// <summary>
        /// Sets the menu content to a fragment of the specified user control type, passing the provided arguments to
        /// its constructor.
        /// </summary>
        /// <remarks>Use this method to dynamically change the menu content to a different user control.
        /// Ensure that the arguments supplied match the expected constructor parameters of the specified user control
        /// type. If the arguments are incompatible, an exception may be thrown during instantiation.</remarks>
        /// <typeparam name="T">The type of user control to display as the menu content. Must derive from UserControl.</typeparam>
        /// <param name="args">An array of arguments to be passed to the constructor of the user control fragment.</param>
        public void SetMenuContent<T>(params object[] args) where T : UserControl
        {
            ucMenu.Content = Instance.GetInstance().GetFragment<T>(args);
        }

        /// <summary>
        /// Sets the main content of the user control to an instance of the specified fragment type.
        /// </summary>
        /// <remarks>This method retrieves an instance of the specified fragment type and assigns it to
        /// the main content area. Ensure that the provided arguments match the expected constructor or initialization
        /// parameters of the fragment type.</remarks>
        /// <typeparam name="T">The type of user control fragment to display as the main content. Must derive from UserControl.</typeparam>
        /// <param name="args">An array of arguments passed to the fragment instance. These arguments are used to initialize the fragment.</param>
        public void SetMainContent<T>(params object[] args) where T : UserControl
        {
            ucMain.Content = Instance.GetInstance().GetFragment<T>(args);
        }
    }
}
