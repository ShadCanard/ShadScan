using ShadDev.Core.NET.Infrastructure;
using ShadScan.Client.Infrastructure.Adorners;
using ShadScan.Client.Models;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;

namespace ShadScan.Client.Fragments.Library
{
    /// <summary>
    /// Logique d'interaction pour ViewLibraryFragment.xaml
    /// </summary>
    public partial class ViewLibraryFragment : UserControl
    {
        private Point _dragStartPoint;
        private ScanItem? _lastDragSource;
        private ScanItem? _lastDragTarget;
        private AdornerLayer? _adornerLayer;
        private DragAdorner? _dragAdorner;
        private DropTargetAdorner? _dropTargetAdorner;
        private ListViewItem? _currentDropTargetContainer;
        private static int _defaultWidth = 100;
        private static int _defaultHeight = 125;
        private ContentFilter _filter;
        private string _selectedValue;

        public ViewLibraryFragment()
        {
            InitializeComponent();
        }

        public ViewLibraryFragment(ContentFilter filter, string selectedValue)
        {
            InitializeComponent();
            _filter = filter;
            _selectedValue = selectedValue;
            LoadContent();
            Instance.GetInstance().GetRepository<ScanItem>().RepositoryEditedEvent += ReloadContent;
        }

        private void ReloadContent(object? sender, RepositoryEventArgs e)
        {
            LoadContent();
        }

        private void LoadContent()
        {

            List<ScanItem> items = Instance.GetInstance().GetRepository<ScanItem>().List();
            switch (_filter)
            {
                case ContentFilter.None:
                    break;
                case ContentFilter.Categories:
                    {
                        var categoryItems = items.Where(i => i.Category?.Name == _selectedValue).ToList();
                        lvContent.ItemsSource = categoryItems;
                    }
                    break;
                case ContentFilter.Files:
                    {
                        var fileItems = items
                            .Where(i => i.Files != null && i.Files.Any(f =>
                                (!string.IsNullOrWhiteSpace(f?.Path) ? f.Path.Replace("/", "\\") : string.Empty)
                                .Contains(_selectedValue ?? string.Empty, StringComparison.OrdinalIgnoreCase)))
                            .ToList();

                        lvContent.ItemsSource = fileItems;
                    }
                    break;
            }
        }

        private void OnPreviewMouseLeftButton(object sender, MouseButtonEventArgs e)
        {
            _dragStartPoint = e.GetPosition(null);
        }

        private void OnMouseOver(object sender, MouseEventArgs e)
        {
            if (e.LeftButton != MouseButtonState.Pressed) return;

            var currentPosition = e.GetPosition(null);
            if (Math.Abs(currentPosition.X - _dragStartPoint.X) < SystemParameters.MinimumHorizontalDragDistance &&
                Math.Abs(currentPosition.Y - _dragStartPoint.Y) < SystemParameters.MinimumVerticalDragDistance)
            {
                return;
            }

            // Find the ListViewItem under the mouse
            var element = e.OriginalSource as DependencyObject;
            while (element != null && !(element is ListViewItem))
            {
                element = VisualTreeHelper.GetParent(element);
            }

            if (element is ListViewItem itemContainer)
            {
                if (itemContainer.DataContext is ScanItem scanItem)
                {
                    var data = new DataObject(typeof(ScanItem).FullName, scanItem);

                    // create drag adorner
                    try
                    {
                        _adornerLayer = AdornerLayer.GetAdornerLayer(lvContent);
                        if (_adornerLayer != null)
                        {
                            _dragAdorner = new DragAdorner(lvContent, itemContainer);
                            var p = e.GetPosition(lvContent);
                            _dragAdorner.SetPosition(p.X + 10, p.Y + 10);
                            _adornerLayer.Add(_dragAdorner);
                        }
                    }
                    catch { /* fallback: ignore adorners */ }

                    try
                    {
                        DragDrop.DoDragDrop(lvContent, data, DragDropEffects.Move);
                    }
                    finally
                    {
                        // remove adorners after drag completes
                        if (_adornerLayer != null && _dragAdorner != null)
                        {
                            _adornerLayer.Remove(_dragAdorner);
                            _dragAdorner = null;
                        }
                        if (_adornerLayer != null && _dropTargetAdorner != null)
                        {
                            _adornerLayer.Remove(_dropTargetAdorner);
                            _dropTargetAdorner = null;
                        }
                        _currentDropTargetContainer = null;
                    }
                }
            }
        }

        private void OnDragOver(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(typeof(ScanItem).FullName) || e.Data.GetDataPresent(typeof(ScanItem)))
            {
                e.Effects = DragDropEffects.Move;
            }
            else
            {
                e.Effects = DragDropEffects.None;
            }
            // update drag adorner position
            try
            {
                if (_dragAdorner != null && sender is UIElement ui)
                {
                    var pos = e.GetPosition(lvContent);
                    _dragAdorner.SetPosition(pos.X + 10, pos.Y + 10);
                }
            }
            catch { }

            // update drop target adorner
            var element = e.OriginalSource as DependencyObject;
            while (element != null && !(element is ListViewItem))
            {
                element = VisualTreeHelper.GetParent(element);
            }

            var targetContainer = element as ListViewItem;
            if (!ReferenceEquals(targetContainer, _currentDropTargetContainer))
            {
                // remove previous
                try
                {
                    if (_adornerLayer != null && _dropTargetAdorner != null)
                    {
                        _adornerLayer.Remove(_dropTargetAdorner);
                        _dropTargetAdorner = null;
                    }

                    _currentDropTargetContainer = targetContainer;

                    if (targetContainer != null && _adornerLayer != null)
                    {
                        _dropTargetAdorner = new DropTargetAdorner(targetContainer);
                        _adornerLayer.Add(_dropTargetAdorner);
                    }
                }
                catch { }
            }

            e.Handled = true;
        }

        private void OnItemDrop(object sender, DragEventArgs e)
        {
            object? data = null;
            if (e.Data.GetDataPresent(typeof(ScanItem).FullName)) data = e.Data.GetData(typeof(ScanItem).FullName);
            else if (e.Data.GetDataPresent(typeof(ScanItem))) data = e.Data.GetData(typeof(ScanItem));

            if (data is not ScanItem sourceItem)
            {
                e.Handled = true;
                return;
            }

            // find the ListViewItem under mouse
            var element = e.OriginalSource as DependencyObject;
            while (element != null && !(element is ListViewItem))
            {
                element = VisualTreeHelper.GetParent(element);
            }

            var targetContainer = element as ListViewItem;
            var targetItem = targetContainer?.DataContext as ScanItem;

            if (targetItem != null && !ReferenceEquals(sourceItem, targetItem))
            {
                OnListViewItemDropped(sourceItem, targetItem);
            }

            // cleanup adorners
            try
            {
                if (_adornerLayer != null && _dragAdorner != null)
                {
                    _adornerLayer.Remove(_dragAdorner);
                    _dragAdorner = null;
                }
                if (_adornerLayer != null && _dropTargetAdorner != null)
                {
                    _adornerLayer.Remove(_dropTargetAdorner);
                    _dropTargetAdorner = null;
                }
            }
            catch { }

            _currentDropTargetContainer = null;

            e.Handled = true;
        }

        private void OnListViewItemDropped(ScanItem source, ScanItem target)
        {
            // store them for later use; currently just keep references
            _lastDragSource = source;
            _lastDragTarget = target;

            int targetLastPageNumber = target.Files != null && target.Files.Count > 0 ? target.Files.Max(f => f.PageNumber) : 0;
            var files = source.Files.ToList();
            if (target.Files == null)
            {
                target.Files = [];
            }

            files.ForEach(f => f.PageNumber += targetLastPageNumber);
            target.Files?.AddRange(files);

            Instance.GetInstance().GetRepository<ScanItem>().Remove(source);
            Instance.GetInstance().GetRepository<ScanItem>().SaveEdit();
        }

        private void OnSetZoomLevel(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            txtZoom.Text = $"Zoom :{e.NewValue}x";

            // compute new sizes based on default and zoom factor
            double factor = e.NewValue;
            double newWidth = _defaultWidth * factor;
            double newHeight = _defaultHeight * factor;

            // adjust realized ListViewItem visuals
            try
            {
                foreach (var item in lvContent.Items)
                {
                    var container = lvContent.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                    if (container == null) continue;

                    // find the inner Grid in the DataTemplate
                    var grid = container.FindVisualChild<Grid>();
                    if (grid != null)
                    {
                        grid.Width = newWidth;
                        grid.Height = newHeight;
                    }

                    // also adjust border if present
                    var border = container.FindVisualChild<Border>();
                    if (border != null && (double.IsNaN(border.Width) || border.Width == 0))
                    {
                        // do not override border explicit sizing if used elsewhere, but ensure it's large enough
                        border.Width = newWidth;
                        border.Height = newHeight;
                    }
                }

                // refresh and relayout
                lvContent.Items.Refresh();
                lvContent.UpdateLayout();
            }
            catch
            {
                // avoid throwing from UI event; ignore if resizing fails
            }
        }

        private void OnOpenItem(object sender, MouseButtonEventArgs e)
        {
            if (lvContent.SelectedItem == null) return;
            Instance.GetInstance()
                .GetStackRepository()
                .Add(
                    Instance
                    .GetInstance()
                    .GetFragment<MainLibraryFragment>(),
                    nameof(MainLibraryFragment)
                );
            Instance
                .GetInstance()
                .GetFragment<FrameLibraryFragment>()
                .SetContent<ItemViewLibraryFragment>(lvContent.SelectedItem.As<ScanItem>());
        }
    }
}
