-- Applications for the bayern e2e tests (administration/e2e-tests/bayern).
-- The applications are only read by 02_check_applications.spec.ts and must not be changed by any test.
-- All applications belong to the region "Augsburg (Stadt)" (id 9).
INSERT INTO
    "public"."applications" (
    "id",
    "regionId",
    "jsonValue",
    "createdDate",
    "accessKey",
    "note",
    "status",
    "statusResolvedDate",
    "rejectionMessage"
)
VALUES
    -- blue1: Freiwilligendienst (FSJ, FÖJ, BFD)
    (
        101,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Lena"},{"name":"surname","type":"String","value":"Schmidt"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Erstantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"volunteerServiceEntitlement","type":"Array","value":[{"name":"programName","type":"String","value":"the program"},{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_101',
        NULL,
        'Pending',
        null,
        null
    ),
    -- blue2: Reservist:in
    (
        102,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Jonas"},{"name":"surname","type":"String","value":"Weber"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Erstantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"blueCardMilitaryReserveEntitlement","type":"Array","value":[{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_102',
        NULL,
        'Pending',
        null,
        null
    ),
    -- blue3: JuLeiCa
    (
        103,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Sophie"},{"name":"surname","type":"String","value":"Wagner"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Verlängerungsantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"blueCardWorkAtOrganizationsEntitlement","type":"Array","value":[{"name":"workAtOrganization","type":"Array","value":[{"name":"organization","type":"Array","value":[{"name":"name","type":"String","value":"organization"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"number 9"},{"name":"houseNumber","type":"String","value":"123"},{"name":"addressSupplement","type":"String","value":"Address number 1"},{"name":"postalCode","type":"String","value":"123456"},{"name":"location","type":"String","value":"12"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"category","type":"TranslatableString","value":"sports"},{"name":"organizationContact","type":"Array","value":[{"name":"name","type":"String","value":"Petra Hoffmann"},{"name":"telephone","type":"String","value":"123456798"},{"name":"email","type":"String","value":"test@gmail.com"},{"name":"hasGivenPermission","type":"Boolean","value":true}]}]},{"name":"responsibility","type":"String","value":"activity 1"},{"name":"amountOfWork","type":"Number","value":56.0},{"name":"workSinceDate","type":"Date","value":"1999-10-10"},{"name":"compensationType","type":"TranslatableString","value":"compensationTypeVolunteerAllowance"},{"name":"compensationAmount","type":"Number","value":840},{"name":"isAlreadyVerified","type":"Boolean","value":false}]}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_103',
        NULL,
        'Pending',
        null,
        null
    ),
    -- blue4: Feuerwehr, Katastrophenschutz, Rettungsdienst
    (
        104,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Lukas"},{"name":"surname","type":"String","value":"Becker"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Erstantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"blueCardWorkAtDepartmentEntitlement","type":"Array","value":[{"name":"organization","type":"Array","value":[{"name":"name","type":"String","value":"organization 1"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street number 1"},{"name":"houseNumber","type":"String","value":"123"},{"name":"addressSupplement","type":"String","value":"Address 123"},{"name":"postalCode","type":"String","value":"123123"},{"name":"location","type":"String","value":"That place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"category","type":"TranslatableString","value":"sports"}]},{"name":"responsibility","type":"String","value":"activity about activity"},{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_104',
        NULL,
        'Pending',
        null,
        null
    ),
    -- blue5: Ehrenamt bei Verein oder Organisation (Erstantrag)
    (
        105,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Marie"},{"name":"surname","type":"String","value":"Schulz"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Erstantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"blueCardWorkAtOrganizationsEntitlement","type":"Array","value":[{"name":"workAtOrganization","type":"Array","value":[{"name":"organization","type":"Array","value":[{"name":"name","type":"String","value":"organization"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"number 9"},{"name":"houseNumber","type":"String","value":"123"},{"name":"addressSupplement","type":"String","value":"Address number 1"},{"name":"postalCode","type":"String","value":"123456"},{"name":"location","type":"String","value":"12"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"category","type":"TranslatableString","value":"sports"},{"name":"organizationContact","type":"Array","value":[{"name":"name","type":"String","value":"Petra Hoffmann"},{"name":"telephone","type":"String","value":"123456798"},{"name":"email","type":"String","value":"test@gmail.com"},{"name":"hasGivenPermission","type":"Boolean","value":true}]}]},{"name":"responsibility","type":"String","value":"activity 1"},{"name":"amountOfWork","type":"Number","value":56.0},{"name":"workSinceDate","type":"Date","value":"1999-10-10"},{"name":"compensationType","type":"TranslatableString","value":"compensationTypeVolunteerAllowance"},{"name":"compensationAmount","type":"Number","value":840},{"name":"isAlreadyVerified","type":"Boolean","value":false}]}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_105',
        NULL,
        'Pending',
        null,
        null
    ),
    -- blue5: Ehrenamt bei Verein oder Organisation (Verlängerungsantrag)
    (
        106,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Felix"},{"name":"surname","type":"String","value":"Koch"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Blaue Ehrenamtskarte"},{"name":"applicationType","type":"String","value":"Erstantrag"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"blueCardJuleicaEntitlement","type":"Array","value":[{"name":"juleicaNumber","type":"String","value":"123456789"},{"name":"juleicaExpiration","type":"Date","value":"1999-10-10"},{"name":"copyOfJuleicaFront","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_106',
        NULL,
        'Pending',
        null,
        null
    ),
    -- gold1: Ehrenzeichen des Bayerischen Ministerpräsidenten
    (
        107,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Hannah"},{"name":"surname","type":"String","value":"Richter"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Goldene Ehrenamtskarte"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"goldenCardHonoredByMinisterPresidentEntitlement","type":"Array","value":[{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_107',
        NULL,
        'Pending',
        null,
        null
    ),
    -- gold2: Reservist:in
    (
        108,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Paul"},{"name":"surname","type":"String","value":"Klein"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Goldene Ehrenamtskarte"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"goldenCardMilitaryReserveEntitlement","type":"Array","value":[{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_108',
        NULL,
        'Pending',
        null,
        null
    ),
    -- gold3: Ehrenamt bei Verein oder Organisation
    (
        109,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Emma"},{"name":"surname","type":"String","value":"Wolf"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Goldene Ehrenamtskarte"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"goldenCardWorkAtOrganizationsEntitlement","type":"Array","value":[{"name":"workAtOrganization","type":"Array","value":[{"name":"organization","type":"Array","value":[{"name":"name","type":"String","value":"organization"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"number 9"},{"name":"houseNumber","type":"String","value":"123"},{"name":"addressSupplement","type":"String","value":"Address number 1"},{"name":"postalCode","type":"String","value":"123456"},{"name":"location","type":"String","value":"12"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"category","type":"TranslatableString","value":"sports"},{"name":"organizationContact","type":"Array","value":[{"name":"name","type":"String","value":"Petra Hoffmann"},{"name":"telephone","type":"String","value":"123456798"},{"name":"email","type":"String","value":"test@gmail.com"},{"name":"hasGivenPermission","type":"Boolean","value":true}]}]},{"name":"responsibility","type":"String","value":"activity 1"},{"name":"amountOfWork","type":"Number","value":56.0},{"name":"workSinceDate","type":"Date","value":"1999-10-10"},{"name":"compensationType","type":"TranslatableString","value":"compensationTypeVolunteerAllowance"},{"name":"compensationAmount","type":"Number","value":840},{"name":"isAlreadyVerified","type":"Boolean","value":false}]}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_109',
        NULL,
        'Pending',
        null,
        null
    ),
    -- gold4: Dienstzeitauszeichnung
    (
        110,
        9,
        '{"name":"application","type":"Array","value":[{"name":"personalData","type":"Array","value":[{"name":"forenames","type":"String","value":"Leon"},{"name":"surname","type":"String","value":"Schröder"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street 32"},{"name":"houseNumber","type":"String","value":"12"},{"name":"addressSupplement","type":"String","value":"Address number 32"},{"name":"postalCode","type":"String","value":"123456789"},{"name":"location","type":"String","value":"my place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"dateOfBirth","type":"Date","value":"1999-10-10"},{"name":"telephone","type":"String","value":"02312312"},{"name":"emailAddress","type":"String","value":"example@gmail.com"}]},{"name":"applicationDetails","type":"Array","value":[{"name":"cardType","type":"String","value":"Goldene Ehrenamtskarte"},{"name":"wantsDigitalCard","type":"Boolean","value":true},{"name":"wantsPhysicalCard","type":"Boolean","value":true},{"name":"goldenCardWorkAtDepartmentEntitlement","type":"Array","value":[{"name":"organization","type":"Array","value":[{"name":"name","type":"String","value":"organization 1"},{"name":"address","type":"Array","value":[{"name":"street","type":"String","value":"street number 1"},{"name":"houseNumber","type":"String","value":"123"},{"name":"addressSupplement","type":"String","value":"Address 123"},{"name":"postalCode","type":"String","value":"123123"},{"name":"location","type":"String","value":"That place"},{"name":"country","type":"String","value":"Deutschland"}]},{"name":"category","type":"TranslatableString","value":"sports"}]},{"name":"responsibility","type":"String","value":"activity about activity"},{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}]},{"name":"hasAcceptedPrivacyPolicy","type":"Boolean","value":true},{"name":"hasAcceptedEmailUsage","type":"Boolean","value":false},{"name":"givenInformationIsCorrectAndComplete","type":"Boolean","value":true}]}]}',
        '2025-06-01 10:00:00',
        'e2e_access_key_110',
        NULL,
        'Pending',
        null,
        null
    )
ON CONFLICT ("id") DO UPDATE SET
                                 "regionId" = "excluded"."regionId",
                                 "jsonValue" = "excluded"."jsonValue",
                                 "createdDate" = "excluded"."createdDate",
                                 "accessKey" = "excluded"."accessKey",
                                 "note" = "excluded"."note",
                                 "status" = "excluded"."status",
                                 "statusResolvedDate" = "excluded"."statusResolvedDate",
                                 "rejectionMessage" = "excluded"."rejectionMessage"
;

select setval('applications_id_seq', (select max("id") from "applications"));
