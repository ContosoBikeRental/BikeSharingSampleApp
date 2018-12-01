using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace app.Models
{
    public class AuthenticateUserRequest
    {
        [JsonProperty("username")]
        [Required]
        public string Username { get; private set; }

        [JsonProperty("password")]
        [Required]
        public string Password { get; private set; }
    }
}
