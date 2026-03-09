using ShadScan.Client.Models.GraphQL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace ShadScan.Client.Infrastructure
{
    /// <summary>
    /// Minimal payload for attaching a file to a scan.
    /// </summary>
    public class ScanFilePayload
    {
        public int ScanId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public string MimeType { get; set; } = "application/octet-stream";
    }

    public class Upload : IDisposable
    {
        private readonly HttpClient _http;

        public Upload(string baseAddress)
        {
            _http = new HttpClient { BaseAddress = new Uri(baseAddress) };
        }

        /// <summary>
        /// Sends the byte array as a multipart/form-data POST to /api/upload.
        /// The scanId field tells the server to attach to an existing scan.
        /// </summary>
        public async Task<string> UploadToScanAsync(ScanFilePayload payload)
        {
            using var mp = new MultipartFormDataContent();

            // add the scanId field
            mp.Add(new StringContent(payload.ScanId.ToString()), "scanId");

            // add the file bytes
            var stream = new MemoryStream(payload.Data);
            var streamContent = new StreamContent(stream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(payload.MimeType);
            mp.Add(streamContent, "file", payload.FileName);

            var response = await _http.PostAsync("api/upload", mp);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public void Dispose() => _http.Dispose();

        public static async Task UploadFileAsync(string filePath, Scan scan)
        {
            byte[] bytes = File.ReadAllBytes(filePath);
            string filename = Path.GetFileName(filePath);

            // Extraire le MimeType du fichier
            string mimeType;
            string ext = Path.GetExtension(filePath)?.ToLowerInvariant() ?? string.Empty;

            mimeType = ext switch
            {
                ".png"  => "image/png",
                ".jpg"  => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".gif"  => "image/gif",
                ".bmp"  => "image/bmp",
                ".webp" => "image/webp",
                ".txt"  => "text/plain",
                ".csv"  => "text/csv",
                ".html" => "text/html",
                ".htm"  => "text/html",
                ".json" => "application/json",
                ".xml"  => "application/xml",
                ".pdf"  => "application/pdf",
                ".zip"  => "application/zip",
                ".tar"  => "application/x-tar",
                ".gz"   => "application/gzip",
                ".mp3"  => "audio/mpeg",
                ".mp4"  => "video/mp4",
                ".mov"  => "video/quicktime",
                _       => "application/octet-stream"
            };

            var pl = new ScanFilePayload
            {
                ScanId = scan.Id,
                FileName = filename,
                Data = bytes,
                MimeType = mimeType
            };

            using var uploader = new Upload("https://localhost:4000/");
            string json = await uploader.UploadToScanAsync(pl);
            Console.WriteLine("Backend replied: " + json);
        }
    }
}
