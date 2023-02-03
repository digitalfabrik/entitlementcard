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

INSERT INTO categories ("id", "name")
VALUES (10, 'Mittagstische') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Mittagstische';

INSERT INTO categories ("id", "name")
VALUES (11, 'Kleidung/Gebrauchtes') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Kleidung/Gebrauchtes';

INSERT INTO categories ("id", "name")
VALUES (12, 'Kultur/Museen/Freizeit') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Kultur/Museen/Freizeit';

INSERT INTO categories ("id", "name")
VALUES (13, 'Bildung') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Bildung';

INSERT INTO categories ("id", "name")
VALUES (14, 'Kinos/Theater/Konzerte ') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Kinos/Theater/Konzerte ';

INSERT INTO categories ("id", "name")
VALUES (15, 'Apotheken/Gesundheit') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Apotheken/Gesundheit';

INSERT INTO categories ("id", "name")
VALUES (16, 'Digitale Teilhabe') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Digitale Teilhabe';

INSERT INTO categories ("id", "name")
VALUES (17, 'Sport/Bewegung/Tanz') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Sport/Bewegung/Tanz';

INSERT INTO categories ("id", "name")
VALUES (18, 'Mobilität') ON CONFLICT ("id")
    DO UPDATE SET
        "name"='Mobilität';
