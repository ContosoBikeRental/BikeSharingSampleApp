using Newtonsoft.Json;

namespace app.Models
{
    public class Job
    {
        [JsonProperty("id")]
        public string Id {get; set;}
    }
}
