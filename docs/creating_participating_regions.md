# Data for participating regions

The data about participating regions is currently stored in the backend under `backend/src/main/resources/sql/create_regions.sql`.
This json file can be created with the following steps:
* Open the following link in your favorite browser (not IE!):
  [https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/antraege/index.php#landkreise](https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/antraege/index.php#landkreise)
* Open the developer console
* Run the following js script:

```js
await (async () => {
  const escapeChars = { "\0": "\\0", "\x08": "\\b", "\x09": "\\t", "\x1a": "\\z", "\n": "\\n", "\r": "\\r", "\"": "\\\"", "'": "\\'", "%": "\\%"}
  const escape = (str) => str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => (char in escapeChars) ? escapeChars[char] : char)

  const data = await Promise.all([...document.querySelectorAll("#content>ul>li>a")].map(anchor => {
    const website = anchor.href
    const fullName = anchor.innerText
    const parts = fullName.split(/(Landkreis|Stadt)/)
    const prefix = parts[1].trim()
    const name = parts[2].trim()
    return fetch("https://gvz.integreat-app.de/api/searchcounty/" + name)
        .then(result => result.json())
        .then(result => {
          const obj = result.find(obj => obj.name == name && obj.type == (prefix == "Stadt" ? "Kreisfreie Stadt" : "Landkreis"))
          return {prefix, name, regionIdentifier: obj.key, website}
        })}))
    return data.map(({prefix, name, regionIdentifier, website}) =>
        `INSERT INTO Regions ("prefix", "name", "regionIdentifier", "website") VALUES ('${escape(prefix)}', '${escape(name)}', '${escape(regionIdentifier)}', '${escape(website)}') `
        + `ON CONFLICT ("regionIdentifier") DO UPDATE SET "prefix"='${escape(prefix)}', "name"='${escape(name)}', "website"='${escape(website)}';`)
      .join("\n")
})()
```

* Copy the contents into the `create_regions.sql`.
