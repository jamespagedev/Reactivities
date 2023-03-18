using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// add services to container
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// configure the http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
}

// app.UseHttpsRedirection(); // we are using http

// app.UseRouting(); // dotnet 6+ automatically uses this

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles(); // plugs into wwwroot folder to serve index.html/index.htm from kestrel server
app.UseStaticFiles(); // serves content from the wwwroot folder

// app.UseEndpoints(endpoints => {}); // not used for dotnet 6 anymore
app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback"); // uses FallbackController.cs
// AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); // section 24 may or may not be needed

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try {
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
} catch (Exception ex) {
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();

// ================================ dotnet 5 setup ================================
// namespace API
// {
//     public class Program
//     {
//         public static async Task Main(string[] args)
//         {
//             AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
//             var host = CreateHostBuilder(args).Build();

//             using var scope = host.Services.CreateScope();

//             var services = scope.ServiceProvider;

//             try {
//                 var context = services.GetRequiredService<DataContext>();
//                 var userManager = services.GetRequiredService<UserManager<AppUser>>();
//                 await context.Database.MigrateAsync();
//                 await Seed.SeedData(context, userManager);
//             } catch (Exception ex) {
//                 var logger = services.GetRequiredService<ILogger<Program>>();
//                 logger.LogError(ex, "An error occured during migration");
//             }

//             await host.RunAsync();
//         }

//         public static IHostBuilder CreateHostBuilder(string[] args) =>
//             Host.CreateDefaultBuilder(args)
//                 .ConfigureWebHostDefaults(webBuilder =>
//                 {
//                     webBuilder.UseStartup<Startup>();
//                 });
//     }
// }
