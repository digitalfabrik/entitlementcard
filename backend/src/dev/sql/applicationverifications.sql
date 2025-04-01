INSERT INTO
    public.applicationverifications ("applicationId","contactEmailAddress","contactName","organizationName","verifiedDate","rejectedDate","accessKey","automaticSource")
VALUES
    (1,'contact@mail.org','Some Contact','Some Organization',NULL,NULL,'U05ybD6uuPOunHHRAPMHKynKTTb4dw7Crqxs3dGwxMjC_tknYul0Xx7CU6ZUepRo6mCqZ-HWLMcZqZZJbCLuXg==','NONE'),
    (2,'contact@mail.org','Some Contact','Some Organization',current_timestamp,NULL,'U05ybD6uuPOunHHRAPMHKynKTTb4dw7Crqxs3dGwxMjC_tknYul0Xx7CU6ZUepRo6mCqZ-HWLMcZqZZJbCLuXg==','NONE'),
    (3,'contact@mail.org','Some Contact','Some Organization',NULL,current_timestamp,'U05ybD6uuPOunHHRAPMHKynKTTb4dw7Crqxs3dGwxMjC_tknYul0Xx7CU6ZUepRo6mCqZ-HWLMcZqZZJbCLuXg==','NONE')
ON CONFLICT ("accessKey")
DO UPDATE SET
    "applicationId" = EXCLUDED."applicationId",
    "contactEmailAddress" = EXCLUDED."contactEmailAddress",
    "contactName" = EXCLUDED."contactName",
    "organizationName" = EXCLUDED."organizationName",
    "verifiedDate" = EXCLUDED."verifiedDate",
    "rejectedDate" = EXCLUDED."rejectedDate",
    "accessKey" = EXCLUDED."accessKey",
    "automaticSource" = EXCLUDED."automaticSource"
;
