# Domains and Projects

Several domains are used for the entitlementcard project.

- `tiles.entitlementcard.app` - Tile server
- `api.entitlementcard.app` - Backend server
- `apt.entitlementcard.app` - SSH server for deployment
- `druckerei.entitlementcard.app` - Web server for `administration`

All of the above domains point to the same production server. This should not be used for development. It maybe used for showcasing the app though. A special environment can be used for showcasing. 

In the following the available environments and their domains are listed.

## Project IDs

The following project IDs exist:

- `nuernberg.sozialpass.app` - Nürnberg project
- `bayern.ehrenamtskarte.app` - Bayern project
- `showcase.entitlementcard.app` - Project for showcasing and testing

The above project IDs look like domains. In fact, they are all domains. Opening any project ID in your browser opens the `administration` frontend.
