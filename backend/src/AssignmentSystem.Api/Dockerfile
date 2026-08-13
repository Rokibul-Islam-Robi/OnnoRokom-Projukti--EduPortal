FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/AssignmentSystem.Api/AssignmentSystem.Api.csproj src/AssignmentSystem.Api/
RUN dotnet restore src/AssignmentSystem.Api/AssignmentSystem.Api.csproj

COPY . .
WORKDIR /src/src/AssignmentSystem.Api
RUN dotnet build AssignmentSystem.Api.csproj -c Release -o /app/build
RUN dotnet publish AssignmentSystem.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "AssignmentSystem.Api.dll"]
