FROM microsoft/dotnet:2.1-sdk
COPY /app /app
WORKDIR /app
RUN dotnet restore app.csproj
RUN dotnet publish -o out app.csproj
ENTRYPOINT ["dotnet", "out/app.dll"]