using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace app.Models
{
    public class Invoice
    {
        [JsonProperty("id")]
        public string Id { get; private set; }

        [JsonProperty("reservationId")]
        public string ReservationId { get; private set; }

        [JsonProperty("customerId")]
        public string CustomerId { get; private set; }

        [JsonProperty("vendorId")]
        public string VendorId { get; private set; }

        [JsonProperty("bikeId")]
        public string BikeId { get; private set; }

        [JsonProperty("amount")]
        public string Amount { get; private set; }
    }
}
