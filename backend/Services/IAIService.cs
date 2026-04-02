using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public interface IAIService
    {
        Task<dynamic> AnalyzeAndIdentifyLeadsAsync(string productId);
        Task<decimal> CalculateMatchScoreAsync(string clientId, string productId);
        Task<IEnumerable<dynamic>> AnalyzeSocialMediaAsync(string socialProfiles);
    }
}
