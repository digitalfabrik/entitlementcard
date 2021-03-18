INSERT INTO categories ("id", "name") 
    VALUES (0, 'Auto/Zweirad') ON CONFLICT ("id") 
        DO UPDATE SET 
            "name"='Auto/Zweirad';

INSERT INTO categories ("id", "name")
VALUES (1, 'Multimedia') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Multimedia';

INSERT INTO categories ("id", "name")
VALUES (2, 'Gesundheit/Sport/Wellness') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Gesundheit/Sport/Wellness';

INSERT INTO categories ("id", "name")
VALUES (3, 'Bildung/Kultur/Unterhaltung') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Bildung/Kultur/Unterhaltung';

INSERT INTO categories ("id", "name")
VALUES (4, 'Dienstleistungen/Finanzen') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Dienstleistungen/Finanzen';

INSERT INTO categories ("id", "name")
VALUES (5, 'Mode/Beauty') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Mode/Beauty';

INSERT INTO categories ("id", "name")
VALUES (6, 'Wohnen/Haus/Garten') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Wohnen/Haus/Garten';

INSERT INTO categories ("id", "name")
VALUES (7, 'Freizeit/Reise/Unterkünfte') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Freizeit/Reise/Unterkünfte';

INSERT INTO categories ("id", "name")
VALUES (8, 'Essen/Trinken/Gastronomie') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Essen/Trinken/Gastronomie';

INSERT INTO categories ("id", "name")
VALUES (9, 'Sonstiges') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Sonstiges';
