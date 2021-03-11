# Generating icon sprites

See the [Modify Icons](https://github.com/maputnik/osm-liberty/blob/gh-pages/README.md#modify-icons) guide for an overview of generating a sprite sheet.
The current icons are in [iconset-osm_libery.json](./iconset-osm_liberty.json).

1. Create icons and place them in this directory. Make sure they are single-path 15x15 SVGs!
1. Go to the [Maki Editor](https://labs.mapbox.com/maki-icons/editor/) and upload [iconset-osm_liberty.json](./iconset-osm_liberty.json)
2. Add icons from this directory.
3. Download the `osm_liberty.zip` and place it in this directory. Extract it to the current directory.
4. You should have an `svgs` directory. Download [these icons](https://github.com/maputnik/osm-liberty/tree/gh-pages/svgs/svgs_not_in_iconset) and put them into the `svgs` directory.
5. Run: 
   ```bash
   spritezero osm-liberty ./svgs/
   spritezero --retina osm-liberty@2x ./svgs/
   ```
6. Move the generated JSONs and PNGs to [../map-tiles/styles/sprites](../map-tiles/styles/sprites)
