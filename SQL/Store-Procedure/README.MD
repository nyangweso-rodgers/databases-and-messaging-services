# Stored Procedure

# Overview of Store Procedure
* __Store Procedure__ is a group of SQL statements stored on the DB side, to perform some action (business logic) or perform any DB-related task. SP may or may not return output and may or may not take arguments, they are optional.

   ```sql
      -- MySQL
      DELIMITER $$
      CREATE PROCEDURE `GetEmp`()
      BEGIN
         SELECT * FROM EMPLOYEE_TABLE;
      END$$
      DELIMITER;
   ```
* _Remarks_
   * we've created a store procedure with the name "GetEmp" which is simply querying an EMPLOYEE_TABLE and fetching all employees. Between BEGIN and END, we've got the body where we write all SQL statements & business logic.

   * In order to call the above procedure, we use the "CALL" keyword.

    ```sql
        CALL GetEmp
    ```