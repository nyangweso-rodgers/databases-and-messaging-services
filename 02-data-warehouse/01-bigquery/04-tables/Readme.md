# BigQuery Tables

## Table Of Contents

# Nested vs. Repeated Columns in Table Schemas

- To create a column with nested data, set the data type of the column to `RECORD` in the schema. A `RECORD` can be accessed as a `STRUCT` type in GoogleSQL. A `STRUCT` is a container of ordered fields.
- To create a column with **repeated data**, set the mode of the column to `REPEATED` in the schema. A **repeated** field can be accessed as an `ARRAY` type in GoogleSQL.
- A `RECORD` column can have `REPEATED` mode, which is represented as an array of `STRUCT` types. Also, a field within a record can be repeated, which is represented as a `STRUCT` that contains an `ARRAY`. An array cannot contain another array directly

# Examples

## 1. Create Nested Columns

- Specifying the **nested columns**:
  ```sql
    create table if not exists `kyosk-prod.<>.rodgers_test`
    (
    id string,
    location
        ARRAY<
        struct<
            country string,
            number_of_years int64>>
    )
  ```
- **Insert** data in **nested columns**
  ```sql
    INSERT INTO `kyosk-prod.karuru_test.rodgers_test` (id, location)
        VALUES (
        "1",
        ARRAY<STRUCT<country STRING, number_of_years INT64>>[
            (STRUCT("Kenya", 1))
        ]
        );
  ```
- Query data in **nested columns**:
  ```sql
    SELECT distinct id,
    location.country,
    location.number_of_years
    FROM `kyosk-prod.karuru_test.rodgers_test`, unnest(location) as location
  ```

# Resources and Further Reading