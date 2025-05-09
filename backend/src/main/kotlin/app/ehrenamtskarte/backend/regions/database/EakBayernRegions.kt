@file:Suppress("ktlint:standard:max-line-length", "MaxLineLength")

package app.ehrenamtskarte.backend.regions.database

// TODO #538: The regions should be dynamically fetched instead of being hardcoded here
val EAK_BAYERN_REGIONS = listOf(
    listOf(
        "Landkreis",
        "Aichach-Friedberg",
        "09771",
        "https://lra-aic-fdb.de/hier-leben/ehrenamt/bayerische-ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Altötting",
        "09171",
        "https://www.lra-aoe.de/kommunale-und-soziale-angelegenheiten/senioren-integration-und-ehrenamt/fachstelle-fuer-das-ehrenamt",
    ),
    listOf("Stadt", "Amberg", "09361", "http://www.engagiert.amberg.de/index.php?id=421"),
    listOf(
        "Landkreis",
        "Amberg-Sulzbach",
        "09371",
        "https://www.kreis-as.de/Menschen-Soziales/Ehrenamt/Ehrenamtskarte",
    ),
    listOf("Stadt", "Ansbach", "09561", "http://www.sonnenzeit-ansbach.de/Ehrenamtskarte/"),
    listOf(
        "Landkreis",
        "Ansbach",
        "09571",
        "http://www.landkreis-ansbach.de/Leben-im-Landkreis/Ehrenamtskarte",
    ),
    listOf(
        "Stadt",
        "Aschaffenburg",
        "09661",
        "http://www.aschaffenburg.de/Buerger-in-Aschaffenburg/Buergerschaftliches-Engagement/Bayerische-Ehrenamtskarte/DE_index_3376.html",
    ),
    listOf(
        "Landkreis",
        "Aschaffenburg",
        "09671",
        "http://www.landkreis-aschaffenburg.de/wer-macht-was/gesund-soziales/sozialesundseni/ehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Augsburg",
        "09761",
        "http://www.augsburg.de/buergerservice-rathaus/buergerservice/dienste-a-z/aemterweise/leistungen-buero-fuer-buergerschaftliches-engagement/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Augsburg",
        "09772",
        "https://www.landkreis-augsburg.de/leben-im-landkreis/ehrenamt/ehrenamtskarte/ehrenamtskarte-beantragen/",
    ),
    listOf(
        "Landkreis",
        "Bad Kissingen",
        "09672",
        "https://www.landkreis-badkissingen.de/buerger--politik/buergerservice/fachbereiche-und-abteilungen/regionalmanagement/die-bayerische-ehrenamtskarte/6377.Die-Bayerische-Ehrenamtskarte-8211-Wir-machen-mit.html",
    ),
    listOf(
        "Landkreis",
        "Bad Tölz-Wolfratshausen",
        "09173",
        "http://www.engagementkompass.net/index.php?id=0,1258",
    ),
    listOf(
        "Stadt",
        "Bamberg",
        "09461",
        "http://www.stadt.bamberg.de/index.phtml?mNavID=1829.376&sNavID=1829.689&La=1",
    ),
    listOf(
        "Landkreis",
        "Bamberg",
        "09471",
        "http://www.stadt.bamberg.de/index.phtml?mNavID=1829.376&sNavID=1829.689&La=1",
    ),
    listOf(
        "Stadt",
        "Bayreuth",
        "09462",
        "http://www.bayreuth.de/rathaus-buergerservice/leben-in-bayreuth/ehrenamt/",
    ),
    listOf(
        "Landkreis",
        "Bayreuth",
        "09472",
        "https://www.landkreis-bayreuth.de/der-landkreis/ehrenamt/",
    ),
    listOf(
        "Landkreis",
        "Berchtesgadener Land",
        "09172",
        "https://www.lra-bgl.de/lw/jugend-familie-soziales/buergerschaftliches-engagementehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Cham",
        "09372",
        "https://www.landkreis-cham.de/service-beratung/ehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Coburg",
        "09463",
        "http://www.coburg.de/desktopdefault.aspx/tabid-2566/2661_read-13746/",
    ),
    listOf(
        "Landkreis",
        "Coburg",
        "09473",
        "http://www.landkreis-coburg.de/files/antragsteller_informationen_eak_coburg.pdf",
    ),
    listOf(
        "Landkreis",
        "Dachau",
        "09174",
        "https://www.landratsamt-dachau.de/soziales-aelter-werden-ehrenamt/ehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Deggendorf",
        "09271",
        "http://www.landkreis-deggendorf.de/leben-arbeiten/ehrenamt-vereine/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Dillingen a.d.Donau",
        "09773",
        "https://www.landkreis-dillingen.de/index.php?id=0,153",
    ),
    listOf(
        "Landkreis",
        "Dingolfing-Landau",
        "09279",
        "https://www.landkreis-dingolfing-landau.de/landkreis/ehrenamt/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Donau-Ries",
        "09779",
        "http://www.donauries.bayern/ehrenamt/ehrenamtskarte-bayern/",
    ),
    listOf("Landkreis", "Ebersberg", "09175", "https://ehrenamt.lra-ebe.de/"),
    listOf(
        "Landkreis",
        "Eichstätt",
        "09176",
        "https://www.landkreis-eichstaett.de/buergerservice-a-z/geschaeftsverteilung?Ehrenamtskarte%20Bayern&view=org&orgid=d41a0f2d-34b5-482b-9416-e202020f359b",
    ),
    listOf(
        "Landkreis",
        "Erding",
        "09177",
        "https://www.landkreis-erding.de/familie-jugend-arbeit-soziales-auslaenderwesen/ehrenamtlich-aktiv/ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Erlangen",
        "09562",
        "https://www.erlangen.de/desktopdefault.aspx/tabid-1166/3813_read-37404/",
    ),
    listOf(
        "Landkreis",
        "Erlangen-Höchstadt",
        "09572",
        "https://www.erlangen-hoechstadt.de/leben-in-erh/ehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Fürstenfeldbruck",
        "09179",
        "https://www.lra-ffb.de/landkreis-politik/ehrenamt-im-landkreis/diebayerischeehrenamtskarte/voraussetzungen-fuer-die-bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Fürth",
        "09563",
        "http://www.fuerth.de/Home/fuerther-rathaus/Ehrenamtskarte/Ehrenamtskarten-beantragen.aspx",
    ),
    listOf(
        "Landkreis",
        "Fürth",
        "09573",
        "http://www.landkreis-fuerth.de/daten-startseite/ehrenamtskarte.html",
    ),
    listOf("Landkreis", "Forchheim", "09474", "http://ehrenamtskarte.lra-fo.de/"),
    listOf(
        "Landkreis",
        "Freising",
        "09178",
        "https://www.kreis-freising.de/buergerservice/abteilungen-und-sachgebiete/sozialverwaltung/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Freyung-Grafenau",
        "09272",
        "https://www.freyung-grafenau.de/leben-und-wohnen/ehrenamt/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Günzburg",
        "09774",
        "http://www.fz-stellwerk.de/ehrenamtskarte/voraussetzungen-antrag/",
    ),
    listOf("Landkreis", "Garmisch-Partenkirchen", "09180", "http://www.ehrenamtskarte-gap.de/"),
    listOf(
        "Landkreis",
        "Haßberge",
        "09674",
        "http://www.ehrenamt-hassberge.de/anerkennung-fuer-das-ehrenamt",
    ),
    listOf(
        "Stadt",
        "Hof",
        "09464",
        "http://www.stadt-hof.de/hof/hof_deu/leben/ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Hof",
        "09475",
        "https://www.landkreis-hof.de/leben/ehrenamt/ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Ingolstadt",
        "09161",
        "http://www2.ingolstadt.de/Bürgerservice/Lebenslagen/Ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Kaufbeuren",
        "09762",
        "http://www.kaufbeuren-aktiv.de/aktiv-werden/bay.-ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Kelheim",
        "09273",
        "https://www.landkreis-kelheim.de/landkreis/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Kitzingen",
        "09675",
        "https://www.kitzingen.de/digitales-buergerbuero/ehrenamt-buergerschaftliches-engagement/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Kronach",
        "09476",
        "http://www.landkreis-kronach.de/bildung-gesundheit-und-soziales/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Kulmbach",
        "09477",
        "http://www.landkreis-kulmbach.de/landratsamt-kulmbach/ehrenamt-im-landkreis-kulmbach/anerkennen-und-danken/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Landsberg am Lech",
        "09181",
        "https://www.keb-landkreis-landsberg.de/ehrenamtskarte/bayerische-ehrenamtskarte/",
    ),
    listOf("Stadt", "Landshut", "09261", "http://www.landshut.de/eak"),
    listOf(
        "Landkreis",
        "Landshut",
        "09274",
        "https://www.landkreis-landshut.de/Landratsamt/Geschaeftsverteilung.aspx?view=~/kxp/orgdata/default&orgid=e95c9ece-54b5-4eda-9acc-56e384e1861d",
    ),
    listOf(
        "Landkreis",
        "Lichtenfels",
        "09478",
        "https://www.lkr-lif.de/landratsamt/weitere-aufgaben/ehrenamtskarte/97.Beantragung_der_Ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Mühldorf a.Inn",
        "09183",
        "http://www.lra-mue.de/buergerservice/themenfelder/soziales-und-senioren/freiwilligenagentur-ehrensache-ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "München",
        "09184",
        "https://www.landkreis-muenchen.de/buergerservice/dienstleistungen-a-z/dienstleistung/ehrenamtskarte-beantragen/",
    ),
    listOf(
        "Stadt",
        "München",
        "09162",
        "https://www.muenchen.de/rathaus/Stadtverwaltung/Direktorium/Engagiert-Leben/engagement_anerkennen.html",
    ),
    listOf(
        "Landkreis",
        "Main-Spessart",
        "09677",
        "https://www.main-spessart.de/buergerservice/leistungen/32..html?detID=616",
    ),
    listOf("Stadt", "Memmingen", "09764", "https://www.memmingen.de/ehrenamtskarte.html"),
    listOf("Landkreis", "Miesbach", "09182", "http://www.landkreis-miesbach.de/Ehrenamtskarte"),
    listOf(
        "Landkreis",
        "Miltenberg",
        "09676",
        "http://www.landkreis-miltenberg.de/Bildung,Soziales-Gesundheit/Ehrenamt/Ehrenamtskarte.aspx",
    ),
    listOf(
        "Stadt",
        "Nürnberg",
        "09564",
        "https://www.nuernberg.de/internet/nuernberg_engagiert/ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Nürnberger Land",
        "09574",
        "http://landkreis.nuernberger-land.de/index.php?id=3272",
    ),
    listOf(
        "Landkreis",
        "Neuburg-Schrobenhausen",
        "09185",
        "http://www.neuburg-schrobenhausen.de/Bayerische-Ehrenamtskarte-im-Landkreis-Neuburg-Schrobenhausen.o10025.html?suche=Ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Neumarkt i.d.OPf.",
        "09373",
        "http://landkreis-neumarkt.de/ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Neustadt a.d.Aisch-Bad Windsheim",
        "09575",
        "http://www.kreis-nea.de/service-themen/gesundheit-soziales/bayerische-ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Neustadt a.d.Waldnaab",
        "09374",
        "https://www.neustadt.de/gesundheit-soziales/ehrenamtskarte/bayerische-ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Neu-Ulm",
        "09775",
        "http://www.landkreis.neu-ulm.de/de/bayerische-ehrenamtskarte/bayerische-ehrenamtskarte-im-landkreis-neu-ulm.html",
    ),
    listOf(
        "Landkreis",
        "Oberallgäu",
        "09780",
        "https://ehrenamtskarte.bayern.de",
    ),
    listOf(
        "Stadt",
        "Passau",
        "09262",
        "http://www.passau.de/LebeninPassau/GesundheitundSoziales/BayerischeEhrenamtskarte.aspx",
    ),
    listOf(
        "Landkreis",
        "Passau",
        "09275",
        "http://www.landkreis-passau.de/landkreis-verwaltung-politik/behoerdenwegweiser/geschaeftsverteilung/?KoordinierungsstellefuerBuergerschaftlichesEngagement&view=org&orgid=d23c9dcd-9b7a-41b2-851e-de669a69aecd",
    ),
    listOf(
        "Landkreis",
        "Pfaffenhofen a.d.Ilm",
        "09186",
        "https://www.landkreis-pfaffenhofen.de/LEBEN/EhrenamtundVereine/BayerEhrenamtskarte.aspx",
    ),
    listOf("Landkreis", "Regen", "09276", "https://www.landkreis-regen.de/ehrenamtskarte/"),
    listOf(
        "Stadt",
        "Regensburg",
        "09362",
        "https://www.regensburg.de/leben/buergerschaftliches-engagement/anerkennung/bayerische-ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Regensburg",
        "09375",
        "http://www.landkreis-regensburg.de/buergerservice/ehrenamt/freiwilligenagentur/?bayerische-ehrenamtskarte&orga=93259",
    ),
    listOf(
        "Landkreis",
        "Rhön-Grabfeld",
        "09673",
        "https://www.rhoen-grabfeld.de/Landkreis/Ehrenamt/Ehrenamtskarte",
    ),
    listOf(
        "Stadt",
        "Rosenheim",
        "09163",
        "https://www.rosenheim.de/stadt-buerger/jugend-familie-soziales/soziale-leistungen/ehrenamtskarte.html?sword_list[]=Ehrenamtskarte&no_cache=1",
    ),
    listOf(
        "Landkreis",
        "Rosenheim",
        "09187",
        "https://www.landkreis-rosenheim.de/ehrenamtskarten-ehrungen-orden/",
    ),
    listOf("Landkreis", "Roth", "09576", "https://www.landratsamt-roth.de/ehrenamtskarte"),
    listOf(
        "Landkreis",
        "Rottal-Inn",
        "09277",
        "https://www.rottal-inn.de/buergerservice-formulare/soziales-soziale-angelegenheiten/ehrenamtskarte/",
    ),
    listOf(
        "Stadt",
        "Schwabach",
        "09565",
        "http://www.schwabach.de/de/zuhause-in-schwabach/buergerengagement/bayerische-ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Schwandorf",
        "09376",
        "https://www.lernreg.de/ehrenamt-im-landkreis-schwandorf-freiwilligenagentur/bayerische-ehrenamtskarte.html",
    ),
    listOf(
        "Stadt",
        "Schweinfurt",
        "09662",
        "https://www.schweinfurt.de/leben-freizeit/ehrenamt-projekte/4362.Bayerische-Ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Schweinfurt",
        "09678",
        "https://www.landkreis-schweinfurt.de/service-infos/serviceleistungen-informationen/ServiceInfos/detail/bayerische-ehrenamtskarte-beantragung-903/",
    ),
    listOf("Landkreis", "Starnberg", "09188", "http://www.lk-starnberg.de/ehrenamtskarte"),
    listOf(
        "Stadt",
        "Straubing",
        "09263",
        "http://www.straubing.de/de/buerger-und-soziales/ehrenamt/",
    ),
    listOf(
        "Landkreis",
        "Straubing-Bogen",
        "09278",
        "http://www.landkreis-straubing-bogen.de/kultur-bildung-sport-soziales/ehrenamt/",
    ),
    listOf(
        "Landkreis",
        "Tirschenreuth",
        "09377",
        "http://www.kreis-tir.de/verwaltung-organisation/fachbereiche/soziales-ehrenamt/ehrenamtskarte/ehrenamtskarte-bayern/",
    ),
    listOf(
        "Landkreis",
        "Traunstein",
        "09189",
        "https://www.traunstein.com/buerger-verwaltung/freiwilligenagentur",
    ),
    listOf("Landkreis", "Unterallgäu", "09778", "http://www.unterallgaeu.de/ehrenamtskarte"),
    listOf(
        "Stadt",
        "Würzburg",
        "09663",
        "https://www.wuerzburg.de/themen/gesundheit-soziales/aktivbuero/ehrenamt/417110.Bayerische-Ehrenamtskarte.html",
    ),
    listOf(
        "Landkreis",
        "Würzburg",
        "09679",
        "http://www.landkreis-wuerzburg.de/Politik_Behörde/Servicestelle_Ehrenamt/Bayerische_Ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Weißenburg-Gunzenhausen",
        "09577",
        "http://www.altmuehlfranken.de/ehrenamtskarte",
    ),
    listOf(
        "Stadt",
        "Weiden i.d.OPf.",
        "09363",
        "https://www.weiden.de/kultur/ehrenamt/ehrenamtskarte",
    ),
    listOf(
        "Landkreis",
        "Weilheim-Schongau",
        "09190",
        "https://www.weilheim-schongau.de/buergerservice/ehrenamtskarte/",
    ),
    listOf(
        "Landkreis",
        "Wunsiedel i.Fichtelgebirge",
        "09479",
        "http://www.landkreis-wunsiedel.de/ehrenamtskarte",
    ),
)
