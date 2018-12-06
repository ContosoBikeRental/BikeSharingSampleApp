using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace app.Models
{
    public interface IVendor
    {
        [JsonProperty("id")]
        string Id { get; set; }

        [JsonProperty("userId")]
        string UserID { get; set; }

        [JsonProperty("routingNumber")]
        string RoutingNumber { get; set; }

        [JsonProperty("accountNumber")]
        string AccountNumber { get; set; }
    }
}
