using ShadScan.Client.Infrastructure;
using ShadScan.Client.Models;
using System.Windows;

namespace ShadScan.Client
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            Instance.GetInstance()
                .SetSettings<ScanSettings>()
                .SetSourceHelper(new SourceHelperBase())
                .UseSettingsWindowCommand(false)
                .CreateRepository<ScanItem>()
                .UseConsoleCommand(false)
                .Init(this);

            base.OnStartup(e);
        }
    }

}
