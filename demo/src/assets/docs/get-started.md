##### Using Angular CLI (v9 and above)

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
npm install @types/datatables.net --save-dev

```

2. Add the dependencies in the scripts and styles attributes to angular.json:

```json
"projects": {
    "your-app-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/datatables.net-dt/css/jquery.dataTables.css"
            ],
            "scripts": [
              "node_modules/jquery/dist/jquery.js",
              "node_modules/datatables.net/js/jquery.dataTables.js"
            ],
            ...
          }
}
```

3. Import the DataTablesModule at the appropriate level of your app.

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
