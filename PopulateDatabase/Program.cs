// --------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// --------------------------------------------------------------------------------------------

using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace app
{
    public class Program
    {
        private static string _gateway = Environment.GetEnvironmentVariable("GATEWAY_DNSNAME");
        

        public static void Main(string[] args)
        {
            _PopulateDatabase().Wait();
        }




        private async static Task _PopulateDatabase()
        {
            await Task.Delay(60000);
            Console.WriteLine("Populating databases...");

            // Read JSON directly from a file
            JObject data = JObject.Parse(File.ReadAllText(@"data.json"));
            JToken customers = (JToken)data.SelectToken("customers");
            JToken vendors = (JToken)data.SelectToken("vendors");
            JToken bikes = (JToken)data.SelectToken("bikes");

            // Define gateway url and HttpClient
            var gatewayServiceUrl = "http://" + _gateway;
            Console.WriteLine("gatewayServiceUrl : " + gatewayServiceUrl);

            var httpClient = new HttpClient();

            // Add users and bikes
            foreach (var customer in customers)
            {
                var response = await httpClient.PostAsync(gatewayServiceUrl + "/api/user/",
                    new StringContent(customer.ToString(), Encoding.UTF8, "application/json"));
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Failed to add : " + customer.ToString());
                    Console.WriteLine(response.StatusCode + "  " + await response.Content.ReadAsStringAsync());
                }
            }
            foreach (var vendor in vendors)
            {
                var response = await httpClient.PostAsync(gatewayServiceUrl + "/api/user/vendor",
                    new StringContent(vendor.ToString(), Encoding.UTF8, "application/json"));
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Failed to add : " + vendor.ToString());
                    Console.WriteLine(response.StatusCode + "  " + await response.Content.ReadAsStringAsync());
                }
            }
            foreach (var bike in bikes)
            {
                var response = await httpClient.PostAsync(gatewayServiceUrl + "/api/bike",
                    new StringContent(bike.ToString(), Encoding.UTF8, "application/json"));
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Failed to add : " + bike.ToString());
                    Console.WriteLine(response.StatusCode + "  " + await response.Content.ReadAsStringAsync());
                }
            }

            Console.WriteLine("Finished populating databases.");
        }
    }
}