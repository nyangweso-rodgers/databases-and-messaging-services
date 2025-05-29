SELECT 
    table_catalog,
    table_schema,
    table_name,
    column_name,
    ordinal_position,
    data_type,
    udt_name,
    character_maximum_length,
    numeric_precision,
    numeric_scale,
    datetime_precision,
    is_nullable,
    column_default,
    collation_name,
    is_updatable
FROM 
    information_schema.columns
WHERE 
    table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY 
    table_schema, table_name, ordinal_position;