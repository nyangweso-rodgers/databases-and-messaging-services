# MySQL Commands

# MySQL Show Users

- How to List All Users in a Database
  - User information for MySQL databases usually exists in the `mysql.user` table. This information includes the `username`, `host`, authentication string (`password`), user’s privileges, and authentication plugins.
  - You can inspect the `mysql.user` table to see this data using:
    ```sql
        DESC mysql.user;
    ```
  - It’s short for the `DESCRIBE` `mysql.user`; command. The output for this command will usually include columns such as **field**, **type**, **null**, **key**, **default**, and **extra**.
  - **Note**: The `DESC mysql.user`; command is also useful for understanding the schema of the mysql.user table before querying more fields.

## How to List All Users in MySQL

- **Method 1**: Using SQL Query
  - This is the most commonly used method because it directly queries the `mysql.user` table
  - Syntax:
    ```sql
        SELECT user FROM mysql.user;
    ```
  - Detailed User List: If you want a more detailed view of the users, such as their hosts and passwords, you can edit the basic syntax:
    ```sql
        SELECT User, Host, authentication_string FROM mysql.user;
    ```

## How to Check MySQL User Privileges

- After listing users on your MySQL database, you may also need to check the privileges and permissions they possess for security purposes.
- To see the user privileges for just one user, run:
  ```sql
    SHOW GRANTS FOR 'username'@'host';
  ```
- To see the privileges for all users on the database, run:
  ```sql
    SELECT CONCAT('SHOW GRANTS FOR \'', user, '\'@\'', host, '\';') FROM mysql.user;
  ```
- **NOTE**: This will generate a batch of grant statements for each user on your database. You can then run each of the `SHOW GRANTS` statements to view the privileges each user has.

## Managing MySQL Users

- To create or add a new user in your database, you can use this command:

  ```sql
    CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
  ```

- To remove a user:

  ```sql
    DROP USER 'username'@'host';
  ```

- If you need to change the password and host of a user as part of routine security management, run:

  ```sql
    ALTER USER 'username'@'host' IDENTIFIED BY 'newpassword';
  ```

- For security purposes, you may need to lock a user account. Run:

  ```sql
    ALTER USER 'username'@'host' ACCOUNT LOCK;
  ```

- Should you need to reactivate it, the following command will do so:
  ```sql
    ALTER USER 'username'@'host' ACCOUNT UNLOCK;
  ```

# References and Further Reading

1. [MySQL SHOW USERS: How to List All Users in a Database](https://www.strongdm.com/blog/mysql-show-users?ref=dailydev)
