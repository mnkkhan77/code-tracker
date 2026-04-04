-- V5__convert_purchase_enums_to_varchar.sql
-- Convert PostgreSQL custom enum columns to VARCHAR so JPA String fields work without casting

ALTER TABLE purchases
    ALTER COLUMN product_type TYPE VARCHAR(50) USING product_type::text,
    ALTER COLUMN status       TYPE VARCHAR(50) USING status::text;
