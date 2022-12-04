# Reactivities

(Udemy) Dotnet Course - https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react

- Setup
  - Open commandline in `Reactivities` directory
    - execute command:
      - Reactivities>`dotnet restore`
  - change directory to `Reactivities\client-app`, and execute command:
    - execute command:
      - Reactivities\client-app>`npm install`

- Run Application
  - Open commandline 1 in `Reactivities\API` directory
    - Execute command:
      - Reactivities\Api>`dotnet run`
  - Open commandline 2 in `Reactivities\client-api` directory
    - Execute command:
      - Reactivities\client-api>`npm start`

- Reset Database
  - Open commandline in `Reactivities` directory
    - Execute command:
      - Reactivities>`dotnet ef database drop -s API -p Persistence`
  - Change directory to `Reactivities\API`
    - Execute command:
      - Reactivities\API>`dotnet watch run`

- Add Migration
  - Open commandline in `Reactivities` directory
    - Execute command examples:
      - Reactivities>`dotnet ef migrations add IdentityAdded -p Persistence -s API`
      - Reactivities>`dotnet ef migrations add ActivityAttendee -p Persistence -s API`

- Remove Previous Latest Migration
  - Open commandline in `Reactivities` directory
    - Execute command:
      - Reactivities>`dotnet ef migrations remove -p Persistence -s API`

- Add New Project
  - Open commandline in `Reactivities` directory
    - Execute commands in order:
      - Reactivities>`dotnet new classlib -n ProjectName` <!-- Creates New Project -->
      - Reactivities>`dotnet sln add NewProjectName` <!-- Adds Project to Solution -->
  - To add it as a reference to the Application and API
    - In commandline change directory to `Reactivities\NewProjectName` directory
      - Execute commands:
        - Reactivities\NewProjectName>`dotnet add reference ..\Application`
        - Reactivities\NewProjectName>`cd ..\API`
        - Reactivities\API>`dotnet add reference ..\NewProjectName`
