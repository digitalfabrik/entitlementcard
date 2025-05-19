INSERT INTO
    public.applicationverifications ("applicationId","contactEmailAddress","contactName","organizationName","verifiedDate","rejectedDate","accessKey","automaticSource")
VALUES
    (1,'contact@mail.org','Some Contact','Some Organization',NULL,NULL,'accesskey_01','NONE'),
    (2,'contact@mail.org','Some Contact','Some Organization',current_timestamp,NULL,'accesskey_02','NONE'),
    (3,'contact@mail.org','Some Contact','Some Organization',NULL,current_timestamp,'accesskey_03','NONE')
ON CONFLICT ("accessKey") DO UPDATE SET
    "applicationId" = EXCLUDED."applicationId",
    "contactEmailAddress" = EXCLUDED."contactEmailAddress",
    "contactName" = EXCLUDED."contactName",
    "organizationName" = EXCLUDED."organizationName",
    "verifiedDate" = EXCLUDED."verifiedDate",
    "rejectedDate" = EXCLUDED."rejectedDate",
    "accessKey" = EXCLUDED."accessKey",
    "automaticSource" = EXCLUDED."automaticSource"
;
