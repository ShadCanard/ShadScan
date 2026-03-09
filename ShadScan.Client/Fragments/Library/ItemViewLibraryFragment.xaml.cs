using ShadScan.Client.Models;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;

namespace ShadScan.Client.Fragments.Library
{
    /// <summary>
    /// Logique d'interaction pour ItemViewLibraryFragment.xaml
    /// </summary>
    public partial class ItemViewLibraryFragment : UserControl, System.ComponentModel.INotifyPropertyChanged
    {
        private ScanItem? _item;
        private int _currentPage = 1;
        private bool _isFirstPage = true;
        private bool _isLastPage = false;
        private bool _showPreviousNextButtons = false;
        private BitmapImage? _currentImage;

        /// <summary>
        /// The ScanItem displayed by this view.
        /// </summary>
        public ScanItem? Item
        {
            get => _item;
            set
            {
                if (!ReferenceEquals(_item, value))
                {
                    _item = value;
                    OnPropertyChanged(nameof(Item));
                }
            }
        }

        /// <summary>
        /// Current displayed page number (1-based).
        /// </summary>
        public int CurrentPage
        {
            get => _currentPage;
            set
            {
                if (_currentPage != value)
                {
                    _currentPage = value;
                    UpdatePaginationFlags();
                    OnPropertyChanged(nameof(CurrentPage));
                }
            }
        }

        public bool IsFirstPage
        {
            get => _isFirstPage;
            private set
            {
                if (_isFirstPage != value)
                {
                    _isFirstPage = value;
                    OnPropertyChanged(nameof(IsFirstPage));
                }
            }
        }

        public bool IsLastPage
        {
            get => _isLastPage;
            private set
            {
                if (_isLastPage != value)
                {
                    _isLastPage = value;
                    OnPropertyChanged(nameof(IsLastPage));
                }
            }
        }

        public bool ShowPreviousNextButtons
        {
            get => _showPreviousNextButtons;
            private set
            {
                if (_showPreviousNextButtons != value)
                {
                    _showPreviousNextButtons = value;
                    OnPropertyChanged(nameof(ShowPreviousNextButtons));
                }
            }
        }

        public BitmapImage? CurrentImage
        {
            get => _currentImage;
            private set
            {
                if (_currentImage != value)
                {
                    _currentImage = value;
                    OnPropertyChanged(nameof(CurrentImage));
                }
            }
        }
        public ItemViewLibraryFragment()
        {
            InitializeComponent();
        }

        public ItemViewLibraryFragment(ScanItem item)
        {
            // Initialize component first to ensure XAML elements are created before we set DataContext
            InitializeComponent();

            // Store model and set DataContext to that model so XAML bindings continue to target the ScanItem properties
            Item = item ?? throw new ArgumentNullException(nameof(item));
            DataContext = Item;

            // Initialize pagination and image values
            CurrentPage = 1;
            CurrentImage = Item?.Files?.FirstOrDefault(f => f.PageNumber == 1)?.Path?.LoadImageFromFile();
            ShowPreviousNextButtons = Item?.HasMultipleFiles ?? false;
            UpdatePaginationFlags();
        }

        private void UpdatePaginationFlags()
        {
            var hasMultiple = Item?.HasMultipleFiles ?? false;
            ShowPreviousNextButtons = hasMultiple;
            IsFirstPage = hasMultiple && CurrentPage == 1;
            IsLastPage = hasMultiple && Item != null && Item.Files != null && CurrentPage == Item.Files.Count;
        }

        private void OnToggleEditMode(object sender, RoutedEventArgs e)
        {

        }


        /// <summary>
        /// Occurs when a property value changes.
        /// </summary>
        public event PropertyChangedEventHandler? PropertyChanged;

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private void OnReturnToLibraryClick(object sender, RoutedEventArgs e)
        {
            Instance.GetInstance().GetFragment<FrameLibraryFragment>().SetContent(nameof(MainLibraryFragment));
            Instance.GetInstance().GetStackRepository().Remove(nameof(MainLibraryFragment));
        }

        private void OnPreviousClick(object sender, RoutedEventArgs e)
        {
            if (!IsFirstPage)
            {
                CurrentPage--;
                CurrentImage = Item?.Files?.FirstOrDefault(f => f.PageNumber == CurrentPage)?.Path?.LoadImageFromFile();
            }
        }

        private void OnOpenClick(object sender, RoutedEventArgs e)
        {
            string? filePath = Item?.Files?.FirstOrDefault(f => f.PageNumber == CurrentPage)?.Path;

            if (Item == null || Item.Files == null || Item.Files.Count == 0 || string.IsNullOrWhiteSpace(filePath)) return;
            Process.Start("explorer.exe", Item?.Files?.First(f => f.PageNumber == CurrentPage)?.Path);
        }
        private void OnPrintClick(object sender, RoutedEventArgs e)
        {
            PrintDocument pd = new PrintDocument();
            pd.PrintPage += (s, args) =>
            {
                System.Drawing.Image img = System.Drawing.Image.FromFile(Item.Files.FirstOrDefault(f => f.PageNumber == CurrentPage).Path);
                System.Drawing.Point loc = new System.Drawing.Point(100, 100);
                args?.Graphics?.DrawImage(img, loc);
            };
            pd.Print();
        }

        private void OnUnbindClick(object sender, RoutedEventArgs e)
        {
            var selectedFile = Item?.Files.First(f => f.PageNumber == CurrentPage);
            var toCopy = new ScanItem()
            {
                Author = Item?.Author,
                Name = System.IO.Path.GetFileName(selectedFile?.Path) ?? "untitled.png",
                Category = Item?.Category,
                Tags = Item?.Tags ?? [],
                Type = Item?.Type ?? ImageType.UNKNOWN,
                Description = Item?.Description ?? "",
                Files =
                [
                    new ScanFile()
                    {
                        PageNumber = 1,
                        Path = selectedFile?.Path ?? ""
                    }
                ]
            };

            Item?.Files?.Remove(Item.Files.First(i => i.PageNumber == CurrentPage));
            Instance.GetInstance().GetRepository<ScanItem>().Add(toCopy);
            Instance.GetInstance().GetRepository<ScanItem>().SaveEdit();
        }

        private void OnNextClick(object sender, RoutedEventArgs e)
        {
            if (!IsLastPage)
            {
                CurrentPage++;
                CurrentImage = Item?.Files?.FirstOrDefault(f => f.PageNumber == CurrentPage)?.Path?.LoadImageFromFile();
            }
        }
    }
}
