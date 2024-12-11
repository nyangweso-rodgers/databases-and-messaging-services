------ create partition table from bigquery table -------------
CREATE TABLE
  `<dataset-name>.<table-name>` 
PARTITION BY
  <partitin field> -- e.g., month, creation_date
AS (
  SELECT
    *
  FROM
    `<project-id>.<dataset-name>.<table-name>`
);