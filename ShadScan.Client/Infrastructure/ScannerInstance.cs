using NAPS2.Images.Wpf;
using NAPS2.Scan;

namespace ShadScan.Client.Infrastructure
{
    public class ScannerInstance
    {
        #region Singleton
        private static ScannerInstance _instance;
        public static ScannerInstance GetInstance()
        {
            if (_instance == null) _instance = new ScannerInstance();
            return _instance;
        }
        #endregion

        private List<ScanDevice>? _devices;
        private ScanningContext _scanningContext;
        private ScanController _scanController;

        public ScannerInstance()
        {
            _scanningContext = new ScanningContext(new WpfImageContext());
            _scanController = new ScanController(_scanningContext);
            _scanController.DeviceUriChanged += DeviceUriChanged;
        }

        private async void DeviceUriChanged(object? sender, DeviceUriChangedEventArgs e)
        {
            if (_scanningContext == null || _scanController == null) Init();
            _devices = await UpdateScanners();
        }

        private void Init()
        {
            if (_scanningContext == null) _scanningContext = new ScanningContext(new WpfImageContext());
            if (_scanController == null) _scanController = new ScanController(_scanningContext);
        }

        private async Task<List<ScanDevice>?> UpdateScanners()
        {
            if (_scanningContext == null || _scanController == null) Init();
            return await _scanController.GetDeviceList();
        }

        public List<ScanDevice> GetScanners()
        {
            if (_scanningContext == null || _scanController == null) Init();
            if (_devices == null) _devices = UpdateScanners().GetAwaiter().GetResult();
            return _devices;
        }

        public async Task<List<ScanDevice>> GetScannersAsync()
        {
            if (_scanningContext == null || _scanController == null) Init();
            if (_devices == null) _devices = await UpdateScanners();
            return _devices;
        }

        public ScanController? GetScannerController(ScanDevice device)
        {
            if (_devices != null && _devices.Contains(device)) return _scanController;
            else return null;
        }

    }
}
