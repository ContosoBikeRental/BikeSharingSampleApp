using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace app.Models
{
    public class Job
    {
        [JsonProperty("id")]
        public string Id {get; set;}
    }
}
