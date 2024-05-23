---------------- shows the total bytes billed for query jobs per user. ---------------
SELECT
  user_email,
  SUM(total_bytes_billed) AS bytes_billed
FROM
  `region-europe-west4.INFORMATION_SCHEMA.JOBS`
WHERE
  job_type = 'QUERY'
  AND statement_type != 'SCRIPT'
GROUP BY
  user_email;