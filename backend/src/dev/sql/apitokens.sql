-- Must be loaded after administrators.sql, as the tokens reference their creator.
-- The tokenHash is the SHA-256 hash of the plaintext token sent as "Authorization: Bearer <token>".
insert into
    "apitokens" (
    "tokenHash", "creatorId", "projectId", "expirationDate", "type"
)
values
    (
        -- Token: 'koblenz-user-import-token'
        decode('4161f07b896bd6524471d5c7099cfde37656dee75e85265ebf9989717f943973', 'hex'),
        (select "id" from "administrators" where "email" = 'project-admin@koblenz.sozialpass.app'),
        (select "id" from "projects" where "project" = 'koblenz.sozialpass.app'),
        '2099-01-01',
        'USER_IMPORT'
    ), (
    -- Token: 'koblenz-user-import-token-expired'
    decode('7915755d4c3ee184fb2dd75dbdb54be523f0ef8e885b26c21aeb675a8c6bc5d1', 'hex'),
    (select "id" from "administrators" where "email" = 'project-admin@koblenz.sozialpass.app'),
    (select "id" from "projects" where "project" = 'koblenz.sozialpass.app'),
    '2021-01-01',
    'USER_IMPORT'
);
