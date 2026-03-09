using Newtonsoft.Json;
using ShadScan.Client.Models.GraphQL;
using System.Net.Http;
using System.Text;

namespace ShadScan.Client.Infrastructure
{
    /// <summary>
    /// Simple GraphQL HTTP helper to call the backend endpoint.
    /// Provides a generic execute method and a few typed helpers based on GraphQLQueries and BackendClass models.
    /// </summary>
    public sealed class GraphQLClient : IDisposable
    {
        private const string GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";
        private readonly HttpClient _httpClient;
        private bool _disposed;

        public GraphQLClient(HttpClient? httpClient = null)
        {
            _httpClient = httpClient ?? new HttpClient() { BaseAddress = new Uri(GRAPHQL_ENDPOINT) };
        }

        public async Task<TData?> SendQueryAsync<TData>(string query, object? variables = null, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query)) throw new ArgumentException("query is required", nameof(query));

            var payload = new
            {
                query,
                variables
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            using var req = new HttpRequestMessage(HttpMethod.Post, GRAPHQL_ENDPOINT) { Content = content };
            using var resp = await _httpClient.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

            resp.EnsureSuccessStatusCode();

            var respContent = await resp.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

            var gqlResp = JsonConvert.DeserializeObject<GraphQLResponse<TData>>(respContent);

            if (gqlResp == null)
            {
                throw new InvalidOperationException("Invalid response from GraphQL server: null");
            }

            if (gqlResp.Errors != null && gqlResp.Errors.Length > 0)
            {
                // Aggregate errors into a single exception message
                var message = string.Join("; ", Array.ConvertAll(gqlResp.Errors, e => e.Message));
                throw new InvalidOperationException($"GraphQL errors: {message}");
            }

            return gqlResp.Data;
        }

        // Typed helpers - adapt as needed

        public Task<ScansQueryResponse?> GetScansAsync(int page = 1, int pageSize = 50, ScanFilterInput? filter = null, CancellationToken ct = default)
        {
            var variables = new { page, pageSize, filter };
            return SendQueryAsync<ScansQueryResponse>(GraphQLQueries.GetScans, variables, ct);
        }

        public Task<ScanQueryResponse?> GetScanAsync(int id, CancellationToken ct = default)
        {
            var variables = new { id };
            return SendQueryAsync<ScanQueryResponse>(GraphQLQueries.GetScan, variables, ct);
        }

        public Task<ScanFilesResponse?> GetScanFilesAsync(int scanId, CancellationToken ct = default)
        {
            var variables = new { scanId };
            return SendQueryAsync<ScanFilesResponse>(GraphQLQueries.GetScanFiles, variables, ct);
        }

        public Task<CategoriesResponse?> GetCategoriesAsync(CancellationToken ct = default)
        {
            return SendQueryAsync<CategoriesResponse>(GraphQLQueries.GetCategories, null, ct);
        }

        public Task<TagsResponse?> GetTagsAsync(CancellationToken ct = default)
        {
            return SendQueryAsync<TagsResponse>(GraphQLQueries.GetTags, null, ct);
        }

        public Task<StatsResponse?> GetStatsAsync(CancellationToken ct = default)
        {
            return SendQueryAsync<StatsResponse>(GraphQLQueries.GetStats, null, ct);
        }

        // Example mutation wrapper
        public Task<CreateScanResponse?> CreateScanAsync(CreateScanInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { input };
            return SendQueryAsync<CreateScanResponse>(GraphQLQueries.CreateScan, variables, ct);
        }

        public Task<UpdateScanResponse?> UpdateScanAsync(int id, UpdateScanInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { id, input };
            return SendQueryAsync<UpdateScanResponse>(GraphQLQueries.UpdateScan, variables, ct);
        }

        public Task<DeleteScanResponse?> DeleteScanAsync(int id, CancellationToken ct = default)
        {
            var variables = new { id };
            return SendQueryAsync<DeleteScanResponse>(GraphQLQueries.DeleteScan, variables, ct);
        }

        public Task<AddScanFileResponse?> AddScanFileAsync(int scanId, string filePath, string fileName, string mimeType, int fileSize, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(filePath)) throw new ArgumentException("filePath is required", nameof(filePath));
            if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("fileName is required", nameof(fileName));
            if (string.IsNullOrWhiteSpace(mimeType)) throw new ArgumentException("mimeType is required", nameof(mimeType));

            var variables = new { scanId, filePath, fileName, mimeType, fileSize };
            return SendQueryAsync<AddScanFileResponse>(GraphQLQueries.AddScanFile, variables, ct);
        }

        public Task<DeleteScanFileResponse?> DeleteScanFileAsync(int id, CancellationToken ct = default)
        {
            var variables = new { id };
            return SendQueryAsync<DeleteScanFileResponse>(GraphQLQueries.DeleteScanFile, variables, ct);
        }

        public Task<CreateCategoryResponse?> CreateCategoryAsync(CreateCategoryInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { input };
            return SendQueryAsync<CreateCategoryResponse>(GraphQLQueries.CreateCategory, variables, ct);
        }

        public Task<UpdateCategoryResponse?> UpdateCategoryAsync(int id, UpdateCategoryInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { id, input };
            return SendQueryAsync<UpdateCategoryResponse>(GraphQLQueries.UpdateCategory, variables, ct);
        }

        public Task<DeleteCategoryResponse?> DeleteCategoryAsync(int id, CancellationToken ct = default)
        {
            var variables = new { id };
            return SendQueryAsync<DeleteCategoryResponse>(GraphQLQueries.DeleteCategory, variables, ct);
        }

        public Task<CreateTagResponse?> CreateTagAsync(CreateTagInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { input };
            return SendQueryAsync<CreateTagResponse>(GraphQLQueries.CreateTag, variables, ct);
        }

        public Task<UpdateTagResponse?> UpdateTagAsync(int id, UpdateTagInput input, CancellationToken ct = default)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));
            var variables = new { id, input };
            return SendQueryAsync<UpdateTagResponse>(GraphQLQueries.UpdateTag, variables, ct);
        }

        public Task<DeleteTagResponse?> DeleteTagAsync(int id, CancellationToken ct = default)
        {
            var variables = new { id };
            return SendQueryAsync<DeleteTagResponse>(GraphQLQueries.DeleteTag, variables, ct);
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                _httpClient?.Dispose();
                _disposed = true;
            }
        }

        // Response envelope
        private class GraphQLResponse<T>
        {
            [JsonProperty("data")]
            public T? Data { get; set; }

            [JsonProperty("errors")]
            public GraphQLError[]? Errors { get; set; }
        }

        private class GraphQLError
        {
            [JsonProperty("message")]
            public string Message { get; set; } = string.Empty;

            [JsonProperty("locations")]
            public object[]? Locations { get; set; }

            [JsonProperty("path")]
            public object[]? Path { get; set; }
        }

        // Typed response wrappers matching GraphQL root fields

        public class ScansQueryResponse
        {
            [JsonProperty("scans")]
            public PaginatedScans? scans { get; set; }
        }

        public class ScanQueryResponse
        {
            [JsonProperty("scan")]
            public Scan? scan { get; set; }
        }

        public class ScanFilesResponse
        {
            [JsonProperty("scanFiles")]
            public List<ScanFile>? scanFiles { get; set; }
        }

        public class CategoriesResponse
        {
            [JsonProperty("categories")]
            public List<Category>? categories { get; set; }
        }

        public class TagsResponse
        {
            [JsonProperty("tags")]
            public List<Tag>? tags { get; set; }
        }

        public class StatsResponse
        {
            [JsonProperty("stats")]
            public Stats? stats { get; set; }
        }

        public class CreateScanResponse
        {
            [JsonProperty("createScan")]
            public Scan? createScan { get; set; }
        }

        public class UpdateScanResponse
        {
            [JsonProperty("updateScan")]
            public Scan? updateScan { get; set; }
        }

        public class DeleteScanResponse
        {
            [JsonProperty("deleteScan")]
            public bool? deleteScan { get; set; }
        }

        public class AddScanFileResponse
        {
            [JsonProperty("addScanFile")]
            public ScanFile? addScanFile { get; set; }
        }

        public class DeleteScanFileResponse
        {
            [JsonProperty("deleteScanFile")]
            public bool? deleteScanFile { get; set; }
        }

        public class CreateCategoryResponse
        {
            [JsonProperty("createCategory")]
            public Category? createCategory { get; set; }
        }

        public class UpdateCategoryResponse
        {
            [JsonProperty("updateCategory")]
            public Category? updateCategory { get; set; }
        }

        public class DeleteCategoryResponse
        {
            [JsonProperty("deleteCategory")]
            public bool? deleteCategory { get; set; }
        }

        public class CreateTagResponse
        {
            [JsonProperty("createTag")]
            public Tag? createTag { get; set; }
        }

        public class UpdateTagResponse
        {
            [JsonProperty("updateTag")]
            public Tag? updateTag { get; set; }
        }

        public class DeleteTagResponse
        {
            [JsonProperty("deleteTag")]
            public bool? deleteTag { get; set; }
        }
    }
}
