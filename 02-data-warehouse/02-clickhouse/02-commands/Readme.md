# SQL Commands

## Table Of Contents

# SQL Commands

## User Management

1. **Check Permission**

   - Example: To check the permissions of the `default` user, run:

     ```sql
        -- sql
        SHOW GRANTS FOR default;
     ```

   - Example: Check Permissions of `default_role`
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

2. **Grant Permissions**

   - Here are some common permissions you can grant:

     1. `SELECT`: Allows reading data from a table.
     2. `INSERT`: Allows inserting data into a table.
     3. `UPDATE`: Allows updating existing data in a table.
     4. `DELETE`: Allows deleting data from a table.
     5. `ALL`: Grants all permissions (equivalent to SELECT, INSERT, UPDATE, DELETE).

   - Example: Grant Full Permissions to `default_role`
     ```sql
        -- sql
        GRANT ALL ON *.* TO default_role WITH GRANT OPTION;
     ```

3. **Create a Dedicated Admin User**
   - Instead of modifying the `default` user or `default_role`, it’s better to create a **dedicated admin user** for administrative tasks.
   - Example: Create the Admin User
     ```sql
        -- sql
        CREATE USER admin_user IDENTIFIED WITH plaintext_password BY 'strong_password';
     ```
   - Example: Grant Full Permissions
     ```sql
        -- sql
        GRANT ALL ON *.* TO admin_user WITH GRANT OPTION;
     ```
   - Use `admin_user` for administrative tasks like **creating users**, **granting permissions**, etc.

# Resources and Further Reading
