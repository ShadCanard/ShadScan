using NAPS2.Images;
using NAPS2.Scan;
using ShadScan.Client.Infrastructure;
using ShadScan.Client.Models;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using Path = System.IO.Path;
namespace ShadScan.Client.Fragments.Scan
{
    /// <summary>
    /// Logique d'interaction pour ResultScanFragment.xaml
    /// </summary>
    public partial class ResultScanFragment : UserControl
    {

        private ScanDevice? _device;
        private ScanController? _controller;
        private BitmapImage? _bitmap;

        public ResultScanFragment()
        {
            InitializeComponent();
            cbxFileType.ItemsSource = Enum.GetValues<ImageType>();
            ScanDevice? Device = Instance.GetInstance().GetFragment<MenuScanFragment>().cbScanners.SelectedItem.As<ScanDevice>();
            if (Device == null) throw new Exception("Impossible de récupérer le scanner sélectionné");
            _device = Device;
            _controller = ScannerInstance.GetInstance().GetScannerController(_device);
            if (_controller != null)
            {
                _controller.ScanStart += OnScanStart;
                _controller.ScanEnd += OnScanEnd;
                _controller.PageStart += OnPageStart;
                _controller.PageEnd += OnPageEnd; ;
                _controller.PageProgress += OnPageProgress;
            }
        }

        private void OnPageStart(object? sender, PageStartEventArgs e)
        {
            //Placeholder
        }

        private void OnPageEnd(object? sender, PageEndEventArgs e)
        {
            //Placeholder
        }

        private void OnPageProgress(object? sender, PageProgressEventArgs e)
        {
            Dispatcher.BeginInvoke(() =>
                {
                    txtStatus.Text = $"{Math.Floor(e.Progress * 100)}%";
                });
        }

        private void OnScanEnd(object? sender, ScanEndEventArgs e)
        {
            Dispatcher.BeginInvoke(() =>
            {
                loading.Visibility = Visibility.Hidden;
                imgPreview.Visibility = Visibility.Visible;
            });
        }

        private void OnScanStart(object? sender, EventArgs e)
        {
            Dispatcher.BeginInvoke(() =>
            {
                loading.Visibility = Visibility.Visible;
                imgPreview.Visibility = Visibility.Hidden;
            });
        }

        public async void LaunchPreviewScan()
        {
            if (_controller != null)
            {
                var scannedImage = _controller.Scan(new ScanOptions
                {
                    Device = _device,
                    Dpi = 100
                });
                var image = await scannedImage.FirstAsync();
                await Dispatcher.BeginInvoke(() =>
                {
                    using (var stream = image.SaveToMemoryStream(ImageFileFormat.Tiff))
                    {
                        var bitmap = new BitmapImage();
                        bitmap.BeginInit();
                        bitmap.CacheOption = BitmapCacheOption.OnLoad;
                        bitmap.StreamSource = stream;
                        bitmap.EndInit();
                        _bitmap = bitmap;
                        this.imgPreview.Source = bitmap;
                    }
                });
            }
        }

        public async void LaunchScan()
        {
            if (_controller != null)
            {
                var scannedImage = _controller.Scan(new ScanOptions
                {
                    Device = _device,
                    Dpi = Convert.ToInt32(Math.Floor(sldDpi.Value))
                });
                var image = await scannedImage.FirstAsync();
                await Dispatcher.BeginInvoke(() =>
                {
                    using var stream = image.SaveToMemoryStream(ImageFileFormat.Tiff);
                    var bitmap = new BitmapImage();
                    bitmap.BeginInit();
                    bitmap.CacheOption = BitmapCacheOption.OnLoad;
                    bitmap.StreamSource = stream;
                    bitmap.EndInit();
                    _bitmap = bitmap;
                    this.imgPreview.Source = bitmap;
                });
            }
        }

        private void OnChangeDPI(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            Dispatcher.BeginInvoke(() =>
            {
                txtDpi?.Text = $"{Convert.ToInt32(Math.Floor(sldDpi.Value))} DPI";
            });
        }

        private void OnSave(object sender, RoutedEventArgs e)
        {
            var defaultPath = Instance.GetInstance().GetSettings<ScanSettings>().DefaultFolder;
            var outputPath = Path.Combine(defaultPath, "output");
            var outputFile = Path.Combine(outputPath, $"scan_{DateTime.Now:yyyyMMdd_HHmmss}.png");
            int cpt = 0;
            BitmapEncoder encoder = new PngBitmapEncoder();
            encoder.Frames.Add(BitmapFrame.Create(_bitmap));
            if(!Directory.Exists(outputPath)) Directory.CreateDirectory(outputPath);

            while(File.Exists(outputFile))
            {
                cpt++;
                outputFile = Path.Combine(outputPath, $"scan_{DateTime.Now:yyyyMMdd_HHmmss}_{cpt}.png");
            }
            var file = File.OpenWrite(outputFile);
            encoder.Save(file);

            Instance.GetInstance().GetRepository<ScanItem>().Add(new ScanItem() { 
                CreationTime = DateTime.Now, 
                Name = $"scan_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.png", 
                Path = outputFile,
                Type = ImageType.UNKNOWN,
            });
        }
    }
}
