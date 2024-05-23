------------ load job history --------------------

SELECT
  DISTINCT(user_email) AS user
FROM
  `region-europe-west4`.INFORMATION_SCHEMA.JOBS
WHERE
  job_type = 'LOAD';