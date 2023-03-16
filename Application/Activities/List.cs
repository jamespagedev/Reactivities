using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var activities = await _context.Activities
                //     .Include(a => a.Attendees)
                //     .ThenInclude(u => u.AppUser)
                //     .OrderBy(o => o.Title)
                //     .ToListAsync(cancellationToken);
                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                // return Result<List<ActivityDto>>.Success(activitiesToReturn);

                // Lets use AutoMapper.QueryableExtensions instead, so the query will only pull what it needs(see output)
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new {currentUsername = _userAccessor.GetUsername()})
                    .OrderBy(o => o.Title)
                    .ToListAsync(cancellationToken);
                
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}