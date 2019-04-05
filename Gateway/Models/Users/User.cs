namespace app.Models
{
    public class User : IUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public UserType Type { get; set; }
    }
}
