INSERT INTO
    public.applicationverifications ("applicationId","contactEmailAddress","contactName","organizationName","verifiedDate","rejectedDate","accessKey","automaticSource")
VALUES
    (1,'contact@mail.org','Some Contact','Some Organization',current_timestamp,NULL,'access_key_01','NONE'),
    (2,'contact@mail.org','Some Contact','Some Organization',NULL,current_timestamp,'access_key_02','NONE'),
    (3,'contact@mail.org','Some Contact','Some Organization',current_timestamp,NULL,'access_key_03','NONE'),
    (4,'contact@mail.org','Some Contact','Some Organization',NULL,current_timestamp,'access_key_04','NONE'),
    (5,'contact@mail.org','Some Contact','Some Organization',NULL,NULL,'access_key_05','NONE'),
    (11,'contact@mail.org','Some Contact','Some Organization',NULL,NULL,'access_key_06','NONE')
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
