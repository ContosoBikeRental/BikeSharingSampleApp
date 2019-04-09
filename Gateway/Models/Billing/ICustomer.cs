using Newtonsoft.Json;

namespace app.Models
{
    public interface ICustomer
    {
        [JsonProperty("id")]
        string Id { get; set; }

        [JsonProperty("userId")]
        string UserID { get; set; }

        [JsonProperty("ccNumber")]
        string CCNumber { get; set; }

        [JsonProperty("ccExpiry")]
        string CCExpiry { get; set; }

        [JsonProperty("ccCCV")]
        string CCCCV { get; set; }
    }
}
