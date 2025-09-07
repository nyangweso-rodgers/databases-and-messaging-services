# ClickHouse SQL Commands

## Table Of Contents

- [ClickHouse SQL Commands](#clickhouse-sql-commands)
  - [Table Of Contents](#table-of-contents)
- [SQL Commands](#sql-commands)
- [1. Access Control Management (Creating Users and Roles in ClickHouse)](#1-access-control-management-creating-users-and-roles-in-clickhouse)
  - [1.1 View Users \& Roles](#11-view-users--roles)
  - [1. Roles](#1-roles)
  - [1.2 Create/Edit Users](#12-createedit-users)
  - [Delete User](#delete-user)
- [2. Database Operations](#2-database-operations)
- [3. Database Table Operations](#3-database-table-operations)
- [Resources and Further Reading](#resources-and-further-reading)

# SQL Commands

# 1. Access Control Management (Creating Users and Roles in ClickHouse)

- **ClickHouse** supports access control management based on **Role-based access control** (**RBAC**) approach.
- Permission Reference:

  1. **Access type**: Access type that's granted or revoked.
  2. **Databases**: Apply the privilege to all databases or one specific database.
  3. **Tables**: Apply the privilege to all tables or one specific table.
  4. **Columns** Apply the privilege to all columns or specific columns.
  5. **Grant option**: Give the permission to execute the `GRANT` query and grant privileges of the same or lower scope.

## 1.1 View Users & Roles

- **Command 1.1**: **View Users and their Roles**

  - Example: **Get a list of users**
    ```sql
      SHOW USERS;
    ```

- **Command 1.1**: **View Users and their Roles**

  - Example: **View the user's roles and privileges**
    ```sql
      SHOW GRANTS FOR <username>
    ```

## 1. Roles

- A **role** is a collection of permissions that can be assigned to one or several users in a **ClickHouse cluster**. Roles allow you to manage privileges and access more efficiently.
- **ClickHouse** uses granular privileges that you can assign directly to a **user** or via **roles**. Common **privileges** include:

  1.  `SELECT`: Read data from tables.
  2.  `INSERT`: Write data to tables.
  3.  `ALTER`: Modify table structure.
  4.  `CREATE`: Create databases or tables.
  5.  `DROP`: Delete databases or tables.
  6.  `ALL`: Full access (use cautiously).
  7.  `UPDATE`: Allows updating existing data in a table.

- **Command**: **View Roles**:

  - Example: **View roles in the cluster**
    ```sql
    SHOW ROLES;
    ```
  - Sample Output:
    1.  `clickpipes`:
    2.  `clickpipes_system`:
    3.  `default_role`: The default role assigned to new users if no other role is specified. It typically has minimal privileges (e.g., `SELECT` on some tables) unless customized
    4.  `sql_console_admin`: An administrative role for the **SQL console** in **ClickHouse Cloud**, likely granting full privileges (`ALL PRIVILEGES`) on all databases and tables, including the ability to manage **users** and **roles** (e.g., `GRANT`, `CREATE USER`).
    5.  `sql_console_read_only`: A read-only role for the **SQL console**, likely limited to `SELECT` and `SHOW` privileges, without rights to modify data or structure (e.g., no `INSERT`, `CREATE`, or `GRANT`).

- **Command**: **Create a Role**

  - Example: **Create a role**:
    ```sql
    CREATE ROLE <role_name>
    -- or
    CREATE ROLE <role_name> SETTINGS <setting> = <setting_value>
    ```
  - (Optional) Grant privileges to the role:
    ```sql
      GRANT SELECT ON <database_name>.* TO <role_name>;
    ```

- **Command**: **Remove Role**
  - Example: **Remove Roles**
    ```sql
    REVOKE <role>
    ```

## 1.2 Create/Edit Users

- **Command 1.2**: **Create a User**

  - Example: **Create a user**
    ````sql
    -- sql
    CREATE USER <username> IDENTIFIED WITH sha256_password BY '<user_password>';
           ```
    ````

- **Command**: Edit `<username>`
  - Example: Edit Username
    ```sql
      ALTER USER <username> RENAME TO <new_username>
    ```

## Delete User

- **Command 1.5**: **Delete a User**

  - Example: Delete a User:
    ```sql
      DROP USER <username>;
    ```

- **Manage ClickHouse Roles**

  - **Commands**:

    1. **Command 1.8**: **Assign a Role to a User**

       - Connect to the cluster with the `admin` user.
       - Example: **Assign a role to a user**
         ```sql
          -- sql
          GRANT <role> TO <username>
         ```

    2. **Command 1.9**: **Edit a Role**

       - Connect to the cluster with the `admin` user.
       - Modify the settings and privileges:
         - Example: **Edit Role Name**
           ```sql
            -- sql
            ALTER ROLE <role_name> RENAME TO <new_role_name>
           ```
         - Example: **Edit Role Setting**
           ```sql
            -- sql
            ALTER ROLE <role_name> SETTINGS <setting> = <new_setting_value>
           ```
         - Example: **Grant Privileges**
           ```sql
            -- sql
            GRANT SELECT ON <database_name>.* TO <role_name>;
           ```
         - Example: **Revoke Privileges**
           ```sql
            -- sql
            REVOKE SELECT(<column_name>) ON <database_name>.<table_name> FROM <role_name>;
           ```

    3. **Command 1.10**: **Delete a Role**
       - Connect to the cluster with the `admin` user.
       - Example: **Delete the role**
         ```sql
          -- sql
          DROP ROLE <role_name>
         ```
       - This also revokes the role from all the users it was assigned to.

# 2. Database Operations

# 3. Database Table Operations

1. **Command**: **Show Database Tables**

   ```sql
    -- sql
    SHOW TABLES FROM <database_name>;
   ```

2. **Command**: **Create Database**

   - SQL Commands to `CREATE` a Database
     ```sql
      -- sql
      CREATE DATABASE <database_name>
     ```
   - If you want to specify an **engine** for the database (e.g., **Atomic** for better transaction support), you can use:
     ```sql
      -- sql
      CREATE DATABASE <database_name> ENGINE = Atomic;
     ```
   - To check if the database exists before creating it, use:
     ```sql
      -- sql
      CREATE DATABASE IF NOT EXISTS <database_name>;
     ```

3. **Command**: **Drop Database Table**

   - SQL Command to Delete a Table
     ```sql
      -- sql
      DROP TABLE IF EXISTS <database_name>.<table_name> SYNC;
     ```
   - `SYNC`: Optional, ensures the drop operation completes synchronously (useful for scripting to avoid race conditions).

4. **Command**: **Create Database Table**
   - Create a new database table by:
     ```sql
      CREATE TABLE <database_name>.<table_name> (
        <field_name> <data_type>,
        <field_name> <data_type>
      ) ENGINE = MergeTree()
      ORDER BY (<field_name>)
     ```

# Resources and Further Reading

1. [double.cloud - Manage ClickHouse® users](https://double.cloud/docs/en/managed-clickhouse/step-by-step/manage-users)
2. [double.cloud - Manage ClickHouse® roles](https://double.cloud/docs/en/managed-clickhouse/step-by-step/manage-roles)
