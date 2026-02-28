using ShadScan.Client.Models;
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
using System.ComponentModel;

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
            if(!IsFirstPage)
            {
                CurrentPage--;
                CurrentImage = Item?.Files?.FirstOrDefault(f => f.PageNumber == CurrentPage)?.Path?.LoadImageFromFile();
            }
        }

        private void OnOpenClick(object sender, RoutedEventArgs e)
        {

        }
        private void OnPrintClick(object sender, RoutedEventArgs e)
        {

        }

        private void OnUnbindClick(object sender, RoutedEventArgs e)
        {

        }

        private void OnNextClick(object sender, RoutedEventArgs e)
        {
            if(!IsLastPage)
            {
                CurrentPage++;
                CurrentImage = Item?.Files?.FirstOrDefault(f => f.PageNumber == CurrentPage)?.Path?.LoadImageFromFile();
            }
        }
    }
}
