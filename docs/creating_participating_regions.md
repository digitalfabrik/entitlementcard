# Data for participating regions

The data about participating regions is currently stored in the backend under `backend/src/main/resources/regions.json`.
This json file can be created with the following steps: under 
* Open the following link in your favorite browser (not IE!):
  [https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/antraege/index.php#landkreise](https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/antraege/index.php#landkreise)
* Open the developer console
* Run the following js script:
```js
JSON.stringify(
   await Promise.all([...document.querySelectorAll("#content>ul>li>a")].map(anchor => {
      const website = anchor.href
      const fullName = anchor.innerText
      const parts = fullName.split(/(Landkreis|Stadt)/)
      const prefix = parts[1].trim()
      const name = parts[2].trim()
      return fetch("https://gvz.integreat-app.de/api/searchcounty/" + name)
         .then(result => result.json())
         .then(result => {
            const obj = result.find(obj => obj.name == name && obj.type == (prefix == "Stadt" ? "Kreisfreie Stadt" : "Landkreis"))
            return { prefix, name, key: obj.key, website }
         })
   })))
```
* Copy the contents into the `regions.json`.
