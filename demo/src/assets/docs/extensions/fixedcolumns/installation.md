##### NPM

You need to install its dependencies:

```bash
# JS file
npm install datatables.net-fixedcolumns --save
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
            ],
            "scripts": [
              ...
              "node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js"
            ],
            ...
}
```

#### Update CSS

Update your global style ( genreally styles.css ) as

 ```css
    /** Fixed columns css 
   
   These classes are injected by fixed columns extensions
   and can be tweaked here to match the colors of headers and body
   to hide the scrolling element behind the fixed header.
   
   */
   
   table.dataTable thead tr > .dtfc-fixed-left,
   table.dataTable thead tr > .dtfc-fixed-right,
   table.dataTable tfoot tr > .dtfc-fixed-left,
   table.dataTable tfoot tr > .dtfc-fixed-right {
     top: 0;
     bottom: 0;
     z-index: 3;
     background-color: white;
   }
   
   table.dataTable tbody tr > .dtfc-fixed-left,
   table.dataTable tbody tr > .dtfc-fixed-right {
     z-index: 1;
     background-color: white;
   }
   
   div.dtfc-left-top-blocker,
   div.dtfc-right-top-blocker {
     background-color: white;
   }
 ```
 Alternative to writing css to global file, you can also install a supported css file for this extension from npm library and update it inside ``styles`` property in angular.json.

```bash
npm install datatables.net-fixedcolumns-bs4 --save
```
