-- show tables in PostgreSQL
    select * 
    from pg_catalog.pg_tables
    where schemaname != 'pg_catalog' and schemaname != 'information_schema'
    -- we used a condition in the WHERE clause to filter system tables. If you omit the WHERE clause, you will get many tables including the system tables.