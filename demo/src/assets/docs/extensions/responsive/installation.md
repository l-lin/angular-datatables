##### NPM

You need to install its dependencies:

```bash
# JS file
npm install datatables.net-responsive --save
# CSS file
npm install datatables.net-responsive-dt --save
```
##### angular.json

Add the dependencies in the scripts and styles attributes:

```json
{
  "projects": {
    "your-app-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              ...
              "node_modules/datatables.net-responsive-dt/css/responsive.dataTables.css"
            ],
            "scripts": [
              ...
              "node_modules/datatables.net-responsive/js/dataTables.responsive.js"
            ],
            ...
}
```
