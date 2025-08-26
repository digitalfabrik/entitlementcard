INSERT INTO
    "public"."administrators" (
    "id",
    "email",
    "projectId",
    "regionId",
    "role",
    "passwordHash",
    "passwordResetKeyHash",
    "passwordResetKeyExpiry",
    "deleted",
    "notificationOnApplication",
    "notificationOnVerification"
)
VALUES
    (
        1, 'admin@bayern.ehrenamtskarte.app', 1, NULL, 'PROJECT_ADMIN',
        decode('2432612431312474535468713552594D39676C36392F4B62394F34644F64505630627169497076696631436B6143416A4C5637696A53683070694671', 'hex'),
        NULL, NULL, false, false, false
    ), (
        2, 'project-admin@koblenz.sozialpass.app', 3, NULL, 'PROJECT_ADMIN',
        decode('243261243131246F4F566962736274762E6177694E47564565444E724F6F4C666A4E626B536B635A783739504666542F666C5179706F315948325147', 'hex'),
        NULL, NULL, false, false, false
    ), (
        3, 'project-store-manager@koblenz.sozialpass.app', 3, NULL, 'PROJECT_STORE_MANAGER',
        decode('243261243131246E6B52563046687A7466553232585543497845786E4F504D545A3133752E67626B4356536C55766F76795A344E6668337759423132', 'hex'),
        NULL, NULL, false, false, false
    ), (
        4, 'project-store-manager@nuernberg.sozialpass.app', 2, NULL, 'PROJECT_STORE_MANAGER',
        decode('243261243131244475626F494F544C633147457870575944377A507175585054446F7245347848594842517967676F78644453394D347355664C586D', 'hex'),
        NULL, NULL, false, false, false
    ), (
        5, 'region-admin@bayern.ehrenamtskarte.app', 1, 1, 'REGION_ADMIN',
        decode('24326124313124343871526343686239343559497069677238357163752F6E6E564270634149626F43426A382F2E596B3061755061484C32726B314B', 'hex'),
        NULL, NULL, false, false, false
    ), (
        6, 'region-admin@koblenz.sozialpass.app', 3, 95, 'REGION_ADMIN',
        decode('2432612431312469724C33372E525A6D395635414B374F4844726A6D4F62704E7A3678396B6630463141374F3973536265337A6965496134757A6343', 'hex'),
        NULL, NULL, false, false, false
    ), (
        7, 'region-admin@nuernberg.sozialpass.app', 2, 94, 'REGION_ADMIN',
        decode('243261243131246F384A7753555663756D38774B4544456A7055556D2E54344B4B4845472F33516957535637304A4A4857656C55614D486D364D592E', 'hex'),
        NULL, NULL, false, false, false
    ), (
        8, 'region-manager@bayern.ehrenamtskarte.app', 1, 1, 'REGION_MANAGER',
        decode('24326124313124573145784F5670627158584A2F4442387675454676753162445446536D67616D6D4A7A4B56674B5638645944552E696E356E7A374B', 'hex'),
        NULL, NULL, false, false, false
    ), (
        9, 'region-manager@koblenz.sozialpass.app', 3, 95, 'REGION_MANAGER',
        decode('243261243131246B54396B54736578523554424A424546765231637A656F6C4A704567594B494D4E72335A42376D63726A6F61393331574C6F707671', 'hex'),
        NULL, NULL, false, false, false
    ), (
    10,
    'verein360@bayern.ehrenamtskarte.app',
    1,
    NULL,
    'EXTERNAL_VERIFIED_API_USER',
    decode(
        '243261243131246344447662704F716D71716C313132434A64563555756E3257704C41496A70713579566E633877304D346368324A32306E50646D57',
        'hex'),
    NULL,
    NULL,
    false,
    false,
    false
    ), (
        11,'project-admin@bayern.ehrenamtskarte.app',1,NULL,'EXTERNAL_VERIFIED_API_USER',
        decode('243261243131246344447662704F716D71716C313132434A64563555756E3257704C41496A70713579566E633877304D346368324A32306E50646D57','hex'),
        NULL,NULL,false,false,false
    ), (
        12, 'freinet@bayern.ehrenamtskarte.app', 1,
        (select "id" from "regions" where "regionIdentifier" = '00000'),
        'REGION_MANAGER',
        decode('243261243131246344447662704F716D71716C313132434A64563555756E3257704C41496A70713579566E633877304D346368324A32306E50646D57', 'hex'),
        NULL, NULL, false, false, false
)
ON CONFLICT ("id") DO UPDATE SET
    "email" = "excluded"."email",
    "projectId" = "excluded"."projectId",
    "regionId" = "excluded"."regionId",
    "role" = "excluded"."role",
    "passwordHash" = "excluded"."passwordHash",
    "passwordResetKeyHash" = "excluded"."passwordResetKeyHash",
    "passwordResetKeyExpiry" = "excluded"."passwordResetKeyExpiry",
    "deleted" = "excluded"."deleted",
    "notificationOnApplication" = "excluded"."notificationOnApplication",
    "notificationOnVerification" = "excluded"."notificationOnVerification"
;
