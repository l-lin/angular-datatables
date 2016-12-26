###angular2-highlight-js

[highlight.js](https://highlightjs.org) integration with Angular2.

###Install

```bash
npm install --save angular2-highlight-js
```

###Setup

####Add highlight.js

Load the highlight.js theme css in your single page

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/monokai_sublime.min.css">
```

and the core script,

```html
 <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/highlight.min.js"></script>
```

and any additional languages

```html
 <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/languages/typescript.min.js"></script>
```

####for SystemJS

In the SystemJs config file (systemjs.config.js) add a mapping for the package

```javascript
var map = {
    ...
    'angular2-highlight-js': 'node_modules/angular2-highlight-js/lib'
};
```

and add the package to the list of packages

```javascript
var packages = {
    ...
    'angular2-highlight-js': { main: 'highlight-js.module', defaultExtension: 'js'}
};
```

####Or for angular-cli

Add the package to **angular-cli.json** 

```json
"packages": [
    "node_modules/angular2-highlight-js/lib"
  ]
```

See the angular-cli (documentation)[https://github.com/angular/angular-cli#3rd-party-library-installation] for more.


Import the **HighlighJsModule** at the appropiate level in your app. If you are going to use the **HighlightJsService** than add the provider too.

For example in **app.module.ts**

```javascript
import { NgModule }       from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from './app.component';
import { DemoComponent } from './demo.component';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; //or for angular-cli the path will be ../../node_modules/angular2-highlight-js

...

@NgModule({
    imports: [
        //A2 stuff
        BrowserModule,
        HighlightJsModule,
    ],
    providers: [
        HighlightJsService
    ],
    declarations: [
        AppComponent,
        DemoComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
```

###Usage

This library contains the **HighlightJsContentDirective** and **HighlightJsService**.
Below are usage notes for each. A demo app is also available as in the [repo](https://github.com/Useful-Software-Solutions-Ltd/angular2-highlight-js/tree/master/demo).


####For HighlightJsContentDirective

Use this to highlight the contents of and element which will be set dynamically (by setting innerHTML for example).

Import the directive and declare it.

```typescript

@Component({
    moduleId: module.id,
    selector: 'demo',
    templateUrl: 'demo.component.html',
    styleUrls: ['demo.component.css']
})
```

Add the attribute **highlight-js-content** to the element which will have content that requires highlighting.
When the content is changed the directive will look for all child elements which match the selector provided and highlight them.
If not selector is given it will default to finding all code elements.

```html
<section [innerHTML]="sampleContent" highlight-js-content=".highlight"></section>
```

####For HighlightJsService

This can be used to highlight code blocks from the code.

Import the service and declare the provider.

```typescript
import { HighlightJsService } from 'angular2-highlight-js';

@Component({
    moduleId: module.id,
    selector: 'demo',
    templateUrl: 'demo.component.html',
    styleUrls: ['demo.component.css']    
})
```

In the component AfterViewInit hook call the **highlight** function passing in the code block element.

```typescript
export class DemoComponent implements OnInit, AfterViewInit {

    constructor(private el: ElementRef, private service : HighlightJsService) {

    }

    ngOnInit() { }

    ngAfterViewInit() {        
        this.service.highlight(this.el.nativeElement.querySelector('.typescript'));
    }
}
```

If you don't use a container that preserve line breaks call with the **useBR** argument true.