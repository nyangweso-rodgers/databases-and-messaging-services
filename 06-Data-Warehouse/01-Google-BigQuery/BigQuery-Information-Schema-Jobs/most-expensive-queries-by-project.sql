------------------- most expensive queries by data processed ---------------
SELECT
 job_id,
 query,
 user_email,
 total_bytes_processed
FROM `kyosk-prod`.`region-europe-west4`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE EXTRACT(DATE FROM  creation_time) = current_date()
ORDER BY total_bytes_processed DESC
LIMIT 4