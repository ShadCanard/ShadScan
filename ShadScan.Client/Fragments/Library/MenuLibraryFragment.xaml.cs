using ShadScan.Client.Infrastructure;
using ShadScan.Client.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
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
    /// Logique d'interaction pour MenuLibraryFragment.xaml
    /// </summary>
    public partial class MenuLibraryFragment : UserControl
    {
        public MenuLibraryFragment()
        {
            InitializeComponent();
            cbTreeViewType.ItemsSource = Enum.GetValues<ContentFilter>();
            cbTreeViewType.Items.Refresh();
            Loaded += OnLoad;
        }

        private void OnLoad(object sender, RoutedEventArgs e)
        {
            Dispatcher.BeginInvoke(() =>
            {
            });
        }

        private async void OnSelectFilter(object sender, SelectionChangedEventArgs e)
        {
            await Dispatcher.BeginInvoke(async () =>
            {
                if (cbTreeViewType.SelectedItem is null) return;
                ContentFilter filter = (ContentFilter)cbTreeViewType.SelectedItem;
                LoadTreeViewByFilter(filter);
            });
        }

        private void LoadTreeViewByFilter(ContentFilter filter)
        {
            List<ScanItem> items = Instance.GetInstance().GetRepository<ScanItem>().List();
            List<TreeViewItem>? Content = null;
            switch (filter)
            {
                case ContentFilter.None:

                    break;
                case ContentFilter.Categories:
                    Content = items.Select(i => i.Category?.Name)?.Distinct().Select(i => new TreeViewItem() { Header = i, }).ToList();
                    break;
                case ContentFilter.Files:
                    {
                        // Build a tree of directories from item paths
                        var dirs = items
                            .Select(i => System.IO.Path.GetDirectoryName(
                                i.Files
                                 .OrderBy(f => f.PageNumber)
                                 .Select(f => f.Path)
                                 .Distinct()
                                 .FirstOrDefault()
                            ))
                            .Where(d => !string.IsNullOrWhiteSpace(d))
                            .Select(d => d!.Replace(Instance.GetInstance().GetSettings<ScanSettings>().DefaultFolder ?? string.Empty, string.Empty)
                                           .TrimStart('\\', '/')
                                           .Replace('\\', '/'))
                            .Distinct();
                        Content = SetTreeViewItem(dirs);
                    }
                    break;
                case ContentFilter.Tags:
                    Content = items.SelectMany(i => i.Tags)?.ToList()?.Distinct().Select(i => new TreeViewItem() { Header = i }).ToList();
                    break;
                case ContentFilter.Authors:
                    Content = items.Select(i => i.Author?.Name)?.Distinct().Select(i => new TreeViewItem() { Header = i }).ToList();
                    break;
            }

            tvItem.ItemsSource = Content;
            tvItem.Items.Refresh();
        }

        private List<TreeViewItem> SetTreeViewItem(IEnumerable<string> dirs)
        {

            var nodeMap = new Dictionary<string, TreeViewItem>(StringComparer.OrdinalIgnoreCase);
            var roots = new List<TreeViewItem>();

            foreach (var dir in dirs)
            {
                var parts = dir.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                string currentPath = string.Empty;
                string? parentPath = null;

                for (int i = 0; i < parts.Length; i++)
                {
                    var part = parts[i];
                    currentPath = string.IsNullOrEmpty(currentPath) ? part : currentPath + "/" + part;

                    if (!nodeMap.TryGetValue(currentPath, out var node))
                    {
                        node = new TreeViewItem { Header = part };
                        nodeMap[currentPath] = node;

                        if (parentPath is null)
                        {
                            roots.Add(node);
                        }
                        else if (nodeMap.TryGetValue(parentPath, out var parentNode))
                        {
                            parentNode.Items.Add(node);
                        }
                    }
                    parentPath = currentPath;
                }
            }

            return roots;
        }

        private void OnSelectedItemTreeviewChange(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            ContentFilter filter = (ContentFilter)cbTreeViewType.SelectedItem;
            var selectedItem = (tvItem.SelectedItem as TreeViewItem)?.Header?.ToString();
            if(selectedItem == null) Instance.GetInstance().GetFragment<MainLibraryFragment>().SetMainContent<ViewLibraryFragment>();
            Instance.GetInstance().GetFragment<MainLibraryFragment>().SetMainContent<ViewLibraryFragment>(filter, selectedItem);

        }
    }
}
