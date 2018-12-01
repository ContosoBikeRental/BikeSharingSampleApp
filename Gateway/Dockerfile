FROM microsoft/dotnet:2.1-sdk
COPY /app /app
WORKDIR /app
RUN dotnet restore app.csproj
RUN dotnet publish -o out app.csproj
ENV ASPNETCORE_URLS http://*:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "out/app.dll"]