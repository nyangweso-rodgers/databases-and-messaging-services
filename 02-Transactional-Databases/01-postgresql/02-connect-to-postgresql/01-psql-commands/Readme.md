# `psql` Commands

## Table Of Contents

# `psql` Commands

- To execute an SQL query, simply type it at the prompt followed by a semicolon (`;`), and hit enter

# Connecting to a Postgres Docker Container

- To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
  ```bash
    docker exec -it <container> psql -U <username>
  ```
- Example:
  ```sh
    docker exec -it postgres psql -U admin -d test_db
  ```

## Command : Check Version

- Check the version with this SQL statement:

  ```sh
    # check the version
    SELECT version();
  ```

## Command : Check the current database

- To see which database you are currently connected to, use the following command:

  ```sh
    test_db=# \conninfo
  ```

- **Sample Output**:
  ```sh
    You are connected to database "test_db" as user "admin" on host "postgres" (address "172.22.0.2") at port "5432".
  ```

## Command : Connect to a specific database

- Use the `\c` command followed by the database name you want to connect to. For example, if you want to connect to `test_db`, you would run:
  ```sh
    #psql
    postgres=# \c test_db
  ```

## Command : Display Database Table

- Display table:

  ```sh
    #psql
    select * from sale_order;
  ```

## Command : List Tables in a Database

- To list all tables in the current database, use the `\dt` command:
  ```sh
    mydb=> \dt
  ```

## Command : Database Table Information

- To get information about a specific table, use the `\d` command followed by the table name:
  ```sh
    mydb=> \d mytable
  ```

## Command : Switch To Another Database Table

- To switch to another database, use the `\c` command followed by the database name:
  ```sh
    mydb=> \c anotherdb
  ```

## Command : Create Database Table

- Create `sale_order` table:
  ```sh
    #psql
    create table sale_order (id varchar(255), item varchar(255), quantity int);
  ```

## Command : Insert Table Row/Data

- insert data into the `sale_order` table
  ```sh
    #psql
    insert into sale_order table values ('SO-TEST-123', 'test item 1', 1);
  ```

## Command : Insert Multiple Table Rows

- Insert multiple rows:
  ```sh
    #psql
    insert into sale_order (id, item, quantity) values ('SO-TEST-2', 'test item 2', 2), ('SO-TEST-3', 'test item 3', 3), ('SO-TEST-4', 'test item 4', 4);
  ```

## Command : Exit `psql`

- To quit `psql`, type `\q` and hit enter:
  ```sh
    mydb=> \q
  ```
