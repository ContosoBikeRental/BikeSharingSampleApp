using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
