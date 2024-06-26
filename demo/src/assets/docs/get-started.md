<h5 id="angular-cli-recommended">Angular CLI<sup style="
    font-size: 14px;
    margin-left: 10px;
">(Recommended)</sup></h5>

```bash
ng add angular-datatables
```

> You can find latest releases on GitHub [here](https://github.com/l-lin/angular-datatables/releases).

##### Manual Installation

1. Install the following packages:

```bash
npm install jquery --save
npm install datatables.net --save
npm install datatables.net-dt --save
npm install angular-datatables --save
npm install @types/jquery --save-dev
```

2. Add the dependencies in the scripts and styles attributes to angular.json:

```json
"projects": {
    "your-app-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/datatables.net-dt/css/dataTables.dataTables.min.css",
            ],
            "scripts": [
              "node_modules/jquery/dist/jquery.js",
              "node_modules/datatables.net/js/dataTables.min.js",
            ],
            ...
          }
}
```

3. Import the DataTablesModule in your app.

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DataTablesModule } from "angular-datatables";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DataTablesModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
