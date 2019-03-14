using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace app.Models
{
    public class CreateVendorRequest : IUser, IVendor
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string UserID { get; set; }
        public string RoutingNumber { get; set; }
        public string AccountNumber { get; set; }
        public UserType Type { get; set; }
    }
}
