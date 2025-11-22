# Administration (Digitale Druckerei)

The administration project contains the React frontends for three audiences:

- Applicants can apply for an entitlementcard
- Organizations can verify or reject application details
- Administrators can manage applications, cards, and regions.

# Folder Structure

The administration frontend relies on [Material UI](https://mui.com) library and the folder structure looks as follows:

- src
  - assets
  - global modules (f.e. `auth` or `cards` with content that is used in this particular context)
    - hooks \*
    - util \*
    - ...components
  - errors (general functions and templates for error handling)
  - graphql (graphl queries and mutations)
  - routes
    - route A \*
      - hooks \*
      - util \*
      - components \*
      - hooks \*
      - ...main controller/view
  - shared (generic reusable components, hooks, assets, used within the application without specific context)
    - hooks \*
    - components \*
    - module B
      - hooks \*
      - util \*
      - ...components
    - util (everything that does not fit in other folders)
  - ...global components (App, Router)

(the \* refers to optional components)
