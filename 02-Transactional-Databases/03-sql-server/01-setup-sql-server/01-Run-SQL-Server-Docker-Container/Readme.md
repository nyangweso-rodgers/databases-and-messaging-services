# Run SQL Server Docker Container

# How to run SQL Server in a Docker container

## Step 1: Create a `docker-compose.yml` File

- To launch an **SQL Server** container, first create a `docker-compose.yml` file in the root of your project. Inside that file, define a `sql-server-db` resource that uses the SQL Server image that Microsoft provides.
  ```yml
  version: "3"
  services:
    sql-server-db:
      container_name: sql-server-db
      image: microsoft/mssql-server-linux:2017-latest
      ports:
        - "1433:1433"
      environment:
        SA_PASSWORD: "change_this_password"
        ACCEPT_EULA: "Y"
  ```

## Conncect to database container

```sh
    mssql -u sa -p change_this_password
```

## Lists Databases Inside SQL Server container

```sh
    mssql> .databases
```

# Resources and Further Reading
