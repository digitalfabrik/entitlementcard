# Reporting Queries

These SQL queries can be used to generate reports on card statistics from the database.

## 1. Total cards issued per project

```sql
SELECT 
    COUNT(*) 
FROM 
    cards 
JOIN 
    "regions" ON cards."regionId" = "regions"."id" 
WHERE 
    "regions"."projectId" = 1 AND "codeType" = 1;
```

## 2. Total cards activated per project

```sql
SELECT 
    COUNT(*) 
FROM 
    cards 
JOIN 
    "regions" ON cards."regionId" = "regions"."id" 
WHERE 
    "regions"."projectId" = 1 AND "codeType" = 1 AND "firstActivationDate" IS NOT NULL;
```

## 3. Total cards activated per project and still valid (not revoked, not expired)

```sql
SELECT
    COUNT(*)
FROM
    cards
JOIN
    "regions" ON cards."regionId" = "regions"."id"
WHERE
    "regions"."projectId" = 1 AND "codeType" = 1 AND "firstActivationDate" IS NOT NULL AND 
    ("expirationDay" IS NULL OR "expirationDay" >= (CURRENT_DATE - DATE '1970-01-01')) AND "revoked"=false;
```
