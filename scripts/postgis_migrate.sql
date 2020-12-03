select *
from public.verguenstigungen;


-- categories
Truncate table public.categories cascade;

select distinct fid_oberkategorie
from public.verguenstigungen;

INSERT INTO public.categories (id, name)
VALUES (0, 'Auto / Zweirad');
INSERT INTO public.categories (id, name)
VALUES (1, 'Multimedia');
INSERT INTO public.categories (id, name)
VALUES (2, 'Gesundheit, Sport/Wellness');
INSERT INTO public.categories (id, name)
VALUES (3, 'Bildung / Kultur / Unterhaltung');
INSERT INTO public.categories (id, name)
VALUES (4, 'Dienstleistungen / Finanzen');
INSERT INTO public.categories (id, name)
VALUES (5, 'Mode / Beauty');
INSERT INTO public.categories (id, name)
VALUES (6, 'Wohnen / Haus / Garten');
INSERT INTO public.categories (id, name)
VALUES (7, 'Freizeit / Reise / Unterkünfte');
INSERT INTO public.categories (id, name)
VALUES (8, 'Essen / Trinken / Gastronomie');

select *
from public.categories;


-- Contacts
-- select MAX(length(verguenstigungen.email)) from public.verguenstigungen;

TRUNCATE table public.contacts cascade;
create temp table contacts_temp
(
    id                  serial,
    email               text,
    telephone           text,
    website             text,
    verguenstigungen_id int
);

INSERT INTO contacts_temp
select nextval('contacts_temp_id_seq'),
       email,
       telefon AS telephone,
       www     as website,
       ogc_fid as verguenstigungen_id
from public.verguenstigungen;

INSERT INTO public.contacts
select id, email, telephone, website
from contacts_temp;



-- Stores
-- select MAX(length(name))
-- from (
-- --
-- ) as temp;

INSERT INTO public.acceptingstores
select nextval('acceptingstores_id_seq')                                                  as id,
       geber                                                                              AS name,
       beschreibung                                                                       as description,
       wkb_geometry                                                                       AS location,
       concat(k_strasse, ' ', k_hsnr, E'\n', k_plz, k_ort)                                as address,
       (select id from contacts_temp where contacts_temp.verguenstigungen_id = v.ogc_fid) as contactId,
       COALESCE(v.fid_oberkategorie, 0)                                                   as categoryId
from public.verguenstigungen v;

-- Cleanup
DROP table contacts_temp;
