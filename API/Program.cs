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

app.UseXContentTypeOptions(); // prevents mime sniffing of content-type
app.UseReferrerPolicy(opt => opt.NoReferrer()); // refers to how much a site allows the browser to control how much information includes during navigation
app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); // add cross-site protection header
app.UseXfo(opt => opt.Deny()); // prevent application being used inside i-frame which protects against click jacking
// app.UseCspReportOnly( <--- use this instead of "app.UseCsp" below to allow and have the content show up in the browser console
app.UseCsp(opt => opt
    .BlockAllMixedContent() // only loads https content(not http content)
    // allows stylesheets only from our domain as approved content
    .StyleSources(s => s.Self()
        .CustomSources("https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "sha256-DpOoqibK/BsYhobWHnU38Pyzt5SjDZuR/mFsAiVN7kk=")) // hash requires update every "npm run build"
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:", "data:", "https://res.cloudinary.com", "https://platform-lookaside.fbsbx.com"))
    .ScriptSources(s => s.Self().CustomSources("https://connect.facebook.net"))
); // whitesource approved content against cross-scripting attacks

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
}
else
{
    // app.UseHsts() <-- doesn't seem to work on production application
    // so we create one ourselves instead
    app.Use(async (context, next) => {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000"); // 1 year of max-age
        await next.Invoke();
    });
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
