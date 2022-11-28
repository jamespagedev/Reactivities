# Reactivities

(Udemy) Dotnet Course - https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react

- Setup

  - Open commandline in `Reactivities` directory
    - execute command:
      - Reactivities>`dotnet restore`
  - change directory to `Reactivities/client-app`, and execute command:
    - execute command:
      - Reactivities/client-app>`npm install`

- Run Application

  - Open commandline 1 in `Reactivities/API` directory
    - Execute command:
      - Reactivities/Api>`dotnet run`
  - Open commandline 2 in `Reactivities/client-api` directory
    - Execute command:
      - Reactivities/client-api>`npm start`

- Reset Database
  - Open commandline in `Reactivities` directory
    - Execute command:
      - Reactivities>`dotnet ef database drop -s API -p Persistence`
  - Change directory to `Reactivities/API`
    - Execute command:
      - Reactivities/API>`dotnet watch run`
