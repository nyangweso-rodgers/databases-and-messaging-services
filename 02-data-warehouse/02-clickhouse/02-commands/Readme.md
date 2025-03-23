# ClickHouse SQL Commands

## Table Of Contents

- [ClickHouse SQL Commands](#clickhouse-sql-commands)
  - [Table Of Contents](#table-of-contents)
- [SQL Commands](#sql-commands)
- [1. Access Control Management (Creating Users and Roles in ClickHouse)](#1-access-control-management-creating-users-and-roles-in-clickhouse)
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

- **Manage ClickHouse Users**

  - **Commands**:

    1. **Command 1.1**: **View Users and their Roles**

       - Connect to the cluster with the `admin` user.
       - Example: **Get a list of users**
         ```sql
          -- sql
          SHOW USERS;
         ```
       - Example: **View the user's roles and privileges**
         ```sql
          -- sql
          SHOW GRANTS FOR <username>
         ```
       - Example: **Check Permissions of** `default_role`
         ```sql
           -- sql
           SHOW GRANTS FOR default_role;
         ```
       - This will return a list of permissions assigned to the role. For example:
         1. `GRANT SELECT ON my_database.* TO default_role`
         2. `GRANT INSERT ON my_database.* TO default_role`
       - Interpret the Results:
         1. If `default_role` has permissions like `GRANT ALL ON *.*`, then the `default` user effectively has full **admin privileges**.
         2. If `default_role` has limited permissions (e.g., only `SELECT` on specific databases), then the `default` user has restricted access.
         3. If `default_role` has the following permissions: `GRANT SELECT ON my_database.* TO default_role;`, Then the `default` user can only read data from `my_database` and cannot perform administrative tasks like creating users or modifying schemas.

    2. **Command 1.2**: **Create a User**

       - Connect to the cluster with the `admin` user.
       - Example: **Create a user**
         ```sql
          -- sql
          CREATE USER <username> IDENTIFIED WITH sha256_password BY '<user_password>';
         ```

    3. **Command 1.3**: **Change a Password**

    4. **Command 1.4**: **Edit a User**

       - Connect to the cluster with the `admin` user.
       - Modify the settings and privileges:
         - Example: Edit `<username>`
           ```sql
             -- sql
             ALTER USER <username> RENAME TO <new_username>
           ```
         - Example: Edit User's settings
           ```sql
            -- sql
            ALTER USER <username> SETTINGS <list_of_ClickHouse_settings>;
           ```
         - Example: Assign Roles
           ```sql
            -- sql
            GRANT <role> TO <username>
           ```
         - Example: Remove Roles
           ```sql
            -- sql
            REVOKE <role>
           ```
         - Example: Grant privileges
           ```sql
            -- sql
            GRANT SELECT ON <database_name>.* TO <username>;
           ```
         - Example: Revoke privileges
           ```sql
            -- sql
            REVOKE SELECT(<column_name>) ON <database_name>.<table_name> FROM <username>;
           ```
       - **Remarks**:
         - By default, the `GRANT` statement appends privileges. If you want to replace them, add the `WITH REPLACE OPTION` clause.
         - If you want to allow the user to grant privileges of the same or lower scope to other users, use `WITH GRANT OPTION`.
         - **Roles** and **privileges** are related, but they serve different purposes. When you give privileges to a specific user, you grant them certain permissions individually. With roles, you can grant a set of privileges to one or several users at the same time.
         - Granting permissions through roles makes it easier to manage them than through assigning them individually.

    5. **Command 1.5**: **Delete a User**
       - Connect to the cluster with the `admin` user.
       - Delete the user:
         ```sql
          -- sql
          DROP USER <username>;
         ```

- **Manage ClickHouse Roles**

  - A **role** is a collection of permissions that can be assigned to one or several users in a **ClickHouse cluster**. Roles allow you to manage privileges and access more efficiently.
  - **ClickHouse** uses granular privileges that you can assign directly to a **user** or via **roles**. Common **privileges** include:

    1.  `SELECT`: Read data from tables.
    2.  `INSERT`: Write data to tables.
    3.  `ALTER`: Modify table structure.
    4.  `CREATE`: Create databases or tables.
    5.  `DROP`: Delete databases or tables.
    6.  `ALL`: Full access (use cautiously).
    7.  `UPDATE`: Allows updating existing data in a table.

  - **Commands**:

    1. **Command 1.6**: **View Roles**

       - Connect to the cluster with the `admin` user.
       - Example: **View roles in the cluster**
         ```sql
          -- sql
          SHOW ROLES;
         ```
       - Sample Output:
         1. `clickpipes`:
         2. `clickpipes_system`:
         3. `default_role`: The default role assigned to new users if no other role is specified. It typically has minimal privileges (e.g., `SELECT` on some tables) unless customized
         4. `sql_console_admin`: An administrative role for the **SQL console** in **ClickHouse Cloud**, likely granting full privileges (`ALL PRIVILEGES`) on all databases and tables, including the ability to manage users and roles (e.g., `GRANT`, `CREATE USER`).
         5. `sql_console_read_only`: A read-only role for the **SQL console**, likely limited to `SELECT` and `SHOW` privileges, without rights to modify data or structure (e.g., no `INSERT`, `CREATE`, or `GRANT`).

    2. **Command 1.7**: **Create a Role**

       - Connect to the cluster with the `admin` user.
       - Create a role:
         ```sql
          -- sql
          CREATE ROLE <role_name>
          // or
          CREATE ROLE <role_name> SETTINGS <setting> = <setting_value>
         ```
       - (Optional) Grant privileges to the role:
         ```sql
           -- sql
           GRANT SELECT ON <database_name>.* TO <role_name>;
         ```

    3. **Command 1.8**: **Assign a Role to a User**

       - Connect to the cluster with the `admin` user.
       - Example: **Assign a role to a user**
         ```sql
          -- sql
          GRANT <role> TO <username>
         ```

    4. **Command 1.9**: **Edit a Role**

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

    5. **Command 1.10**: **Delete a Role**
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
