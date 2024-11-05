# How to Update Column Data Type

- We can delete a column in BigQuery, but it requires a workaround since BigQuery doesn’t natively support direct column deletion from an existing table. Instead, you need to create a new table without the unwanted column and then replace the original table. Here’s a step-by-step approach:

- Example 1 (Change Column Data Type From `NUMERIC` to `STRING`):
  - Remark:
    - In BigQuery, when altering a column to change its data type from `NUMERIC` to `STRING`, the command will fail if data conversion isn’t implicitly possible. To handle this, you can create a new column with the desired data type, transfer the data, and then remove the original column if needed.
  - Step 1. Add a New Column with the desired data type:
    ```sql
      alter table `<dataset_name>.<table_name>`
      ADD COLUMN new_column_name STRING;
    ```
  - Step 2. Update the New Column with values from the original column, casting `NUMERIC` to `STRING`:
    ```sql
      UPDATE `<dataset_name>.<table_name>`
      SET new_column_name = CAST(old_column_name AS STRING)
      WHERE TRUE;
    ```
    - **Remark**:
      - In BigQuery, `UPDATE` statements require a `WHERE` clause to avoid unintentionally updating all rows. If you intend to update all rows, you can use `WHERE` `TRUE` to satisfy the requirement.
  - Step 3. Drop the Original Column
    ```sql
      ALTER TABLE `<dataset_name>.<table_name>`
      DROP COLUMN old_column_name;
    ```
  - Step 4. Rename the New Column to match the original column’s name:
    ```sql
      ALTER TABLE `<dataset_name>.<table_name>`
      RENAME COLUMN new_column_name TO old_column_name;
    ```
