using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous] // allows index.html to be served
    public class FallbackController : Controller // ControllerBase does not have view support, so we use Controller
    {
        public IActionResult Index() 
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), 
                "wwwroot", "index.html"), "text/HTML");
        }
    }
}