# psql Commands

## Table Of Contents

- To execute an SQL query, simply type it at the prompt followed by a semicolon (`;`), and hit enter

1. **Command 1**: **Check Version**

   - Check the version with this SQL statement:

     ```sh
       # check the version
       SELECT version();
     ```

2. **Command 2**: **Check the Current Database**

   - To see which database you are currently connected to, use the following command:

     ```sh
       <database_name>=# \conninfo
     ```

   - Sample Output:

     ```sh
       # You are connected to database "customers" as user "postgres" on host "postgres" (address "172.18.0.2") at port "5432".
     ```

3. **Command 3**: **Create Database**

   - Create database by:
     ```sh
      CREATE DATABASE <database_name>
     ```

4. **Command 4**: **Connect to a Specific Database**

   - Use the `\c` command followed by the <database_name> you want to connect to.
     ```sh
       #psql
       postgres=# \c <database_name>
     ```

5. **Command 5**: **List Tables in a Database**

   - To list all tables in the current database, use the `\dt` command:
     ```sh
       <database_name>=> \dt
     ```

6. **Command 6**: **Display Database Table**

   - Display database table:

     ```sh
       #psql
       select * from <table_name>;
     ```

7. **Command 7**: **Database Table Information**

   - To get information about a specific table, use the `\d` command followed by the table name:
     ```sh
       <database_name>=> \d <table_name>
     ```

8. **Command 7**: **Switch To Another Database Table**

   - To switch to another database, use the `\c` command followed by the database name:
     ```sh
       <database_name>=> \c <database_name2>
     ```

9. **Command 9**: **Create Database Table**

   - Example: Create `sale_order` table:
     ```sh
       #psql
       create table <table_name> (id varchar(255), item varchar(255), quantity int);
     ```

10. **Command 10**: **Insert Table Row/Data**

    - Example:insert data into the `sale_order` table
      ```sh
        #psql
        insert into <table_name> table values ('SO-TEST-123', 'test item 1', 1);
      ```

11. **Command 11**: Insert** Multiple Table Rows**

    - Example: Insert multiple rows:
      ```sh
        #psql
        insert into <table_name> (id, item, quantity) values ('SO-TEST-2', 'test item 2', 2), ('SO-TEST-3', 'test item 3', 3), ('SO-TEST-4', 'test item 4', 4);
      ```

# Resources and Further Reading
