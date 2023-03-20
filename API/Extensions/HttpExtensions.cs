using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            // spelling must be exact and case-sensitive
            // response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); <-- not needed since we added to "WithExposedHeaders(...)" in ApplicationServiceExtensions.cs
        }
    }
}