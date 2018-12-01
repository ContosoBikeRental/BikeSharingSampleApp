using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System;

namespace app.Models
{
    public class Customer : ICustomer
    {
        public string Id { get; set; }
        public string UserID { get; set; }
        public string CCNumber { get; set; }
        public string CCExpiry { get; set; }
        public string CCCCV { get; set; }
    }
}
