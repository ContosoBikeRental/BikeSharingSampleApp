using Microsoft.AspNetCore.Mvc;

namespace app.Controllers
{
    [Route("hello")]
    public class HelloController : Controller
    {
        // GET: api/job/1
        [HttpGet]
        public string Hello()
        {
            return "Hello!";
        }
    }
}
