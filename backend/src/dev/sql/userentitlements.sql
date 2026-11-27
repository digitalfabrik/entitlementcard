insert into
    "userentitlements" (
    "userHash", "startDate", "endDate", "revoked", "regionId"
)
values
    (
        -- Name: 'Karla Koblenz'
        -- Date of birth: '10.06.2003'
        -- File number: '100K'
        '$argon2id$v=19$m=19456,t=2,p=1$3F1KRz+y0fnze6Xg4fpLIrZOzVOIAhOayk5ibL4UXNo',
        '2021-01-01',
        '2099-01-01',
        false,
        96
    ), (
    -- Name: 'ø Ø æ Æ å Å ð Ð þ Þ'
    -- Date of birth: '10.06.2003'
    -- File number: '123K'
    '$argon2id$v=19$m=19456,t=2,p=1$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY', '2021-01-01', '2099-01-01', false, 96
), (
    -- Name: 'Erika Entzogen'
    -- Date of birth: '28.05.2003'
    -- File number: '000D000001'
    '$argon2id$v=19$m=19456,t=2,p=1$zf7vqckgmYBPbjjW1CwqudF+OjHmo2EifgxhuuVHFs0', '2021-01-01', '2099-01-01', true, 96
);
