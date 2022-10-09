using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.OrderBy(o=>o.Title).ToListAsync(cancellationToken); // using Microsoft.EntityFrameworkCore
            }
        }
        /* Example of how to handle a cancellation token in case the user cancels the request during the api call
        Note: you will also need to pass in the cancellation token from the controller, for example...
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct){
            return await Mediator.Send(new List.Query(), ct);
        }

        Cancellation token handling begins here...
        public Handler(DataContext context, ILogger<List> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                try {
                    for (var i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);
                        _logger.LogInformation($"Task {i} has completed");
                    }
                } catch (Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation($"Task was cancelled");
                }
                return await _context.Activities.ToListAsync(cancellationToken); // using Microsoft.EntityFrameworkCore
            }
        }*/
    }
}