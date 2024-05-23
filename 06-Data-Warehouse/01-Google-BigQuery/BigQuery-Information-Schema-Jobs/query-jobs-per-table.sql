-------------- https://cloud.google.com/bigquery/docs/information-schema-jobs#query_jobs_per_table ------------
SELECT
  t.project_id,
  t.dataset_id,
  t.table_id,
  COUNT(*) AS num_references
FROM
  `kyosk-prod`.`region-europe-west4`.INFORMATION_SCHEMA.JOBS, UNNEST(referenced_tables) AS t
GROUP BY
  t.project_id,
  t.dataset_id,
  t.table_id
ORDER BY
  num_references DESC;