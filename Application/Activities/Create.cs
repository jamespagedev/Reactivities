using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; } // using Domain
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context) // inject for persisting changes
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity); // use AddAsync for Microsoft SQL Server
                await _context.SaveChangesAsync();
                return Unit.Value; // doesn't return anything, but lets our api controller know we are finished with this handle body.
            }
        }
    }
}