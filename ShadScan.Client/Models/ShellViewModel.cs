using MahApps.Metro.Controls;
using ShadDev.Core.NET.Infrastructure;
using ShadDev.Core.NET.Infrastructure.Hamburger;
using ShadScan.Client.Pages;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;

namespace ShadScan.Client.Models
{
    public class ShellViewModel : BindableBase
    {
        private static readonly ObservableCollection<MenuItem> AppMenu = new ObservableCollection<MenuItem>();
        private static readonly ObservableCollection<MenuItem> AppOptionsMenu = new ObservableCollection<MenuItem>();

        public ObservableCollection<MenuItem> Menu => AppMenu;

        public ObservableCollection<MenuItem> OptionsMenu => AppOptionsMenu;

        public ShellViewModel()
        {
            // Build the menus
            this.Menu.Add(new MenuItem()
            {
                Icon = "A",
                Label = "Accueil",
                NavigationType = typeof(HomePage),
                NavigationDestination = new Uri("Pages/HomePage.xaml", UriKind.RelativeOrAbsolute)
            });
            this.Menu.Add(new MenuItem()
            {
                Icon = "S",
                Label = "Scan",
                NavigationType = typeof(ScanPage),
                NavigationDestination = new Uri("Pages/ScanPage.xaml", UriKind.RelativeOrAbsolute)
            });
            this.Menu.Add(new MenuItem()
            {
                Icon = "B",
                Label = "Bibliothèque",
                NavigationType = typeof(LibraryPage),
                NavigationDestination = new Uri("Pages/LibraryPage.xaml", UriKind.RelativeOrAbsolute)
            });

            this.OptionsMenu.Add(new MenuItem()
            {
                Icon = "S",
                Label = "Settings",
                NavigationType = typeof(SettingsPage),
                NavigationDestination = new Uri("Pages/SettingsPage.xaml", UriKind.RelativeOrAbsolute)
            });
        }
    }
}
