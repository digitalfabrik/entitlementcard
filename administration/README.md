# Administration (Digitale Druckerei)

The administration project contains the React frontends for three audiences:

- Applicants can apply for an entitlementcard
- Organizations can verify or reject application details
- Administrators can manage applications, cards, and regions.

# Folder Structure

The administration frontend relies on [Blueprint](https://blueprintjs.com) and the [Material UI](https://mui.com) library. The latter is used for sites that need to be responsive, i.e. sites targeting applicants and organizations.
To keep the usage of the libraries separated (to keep a unified look and feel) the folder structure looks as follows:

- src
  - bp-modules
    - module A
      - hooks \*
      - util \*
      - ...components
    - module B
      - hooks \*
      - util \*
      - ...components
    - hooks \*
    - util \*
    - ...general components
  - mui-modules
    - module A
      - hooks \*
      - util \*
      - ...components
    - module B
      - hooks \*
      - util \*
      - ...components
    - hooks \*
    - util \*
    - ...general components
  - ...global modules
  - ...global components

(the \* refers to optional components)
