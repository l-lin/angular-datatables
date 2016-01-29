angular-datatables [![Build Status](https://travis-ci.org/l-lin/angular-datatables.png?branch=master)](https://travis-ci.org/l-lin/angular-datatables) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Stories in Ready](https://badge.waffle.io/l-lin/angular-datatables.png?label=TODO&title=TODO)](http://waffle.io/l-lin/angular-datatables)
================
> Angular module that provides a `datatable` directive along with datatable options helpers.

Notes
-----

The required dependencies are:

* [AngularJS](http://angular.org) (tested with version 1.3.0+)
* [jQuery](http://jquery.com) (tested with version 1.11.0+)
* [Datatables](https://datatables.net) (tested with version 1.10+)

This module has been tested with the following datatables modules:

* [ColReorder](https://datatables.net/extras/colreorder/) with version 1.1.0
* [ColVis](https://datatables.net/extras/colvis/) with version 1.1.0
* [TableTools](https://datatables.net/extras/tabletools/) with version 2.2.0
* [ColumnFilter](http://jquery-datatables-column-filter.googlecode.com/svn/trunk/index.html) with version 1.5.6
* [FixedColumns](https://datatables.net/extensions/fixedcolumns/) with version 3.0.2
* [FixedHeader](https://datatables.net/extensions/fixedheader/) with version 2.1.2
* [Responsive](https://datatables.net/extensions/responsive/) with version 1.0.1
* [Scroller](http://datatables.net/extensions/scroller/) with version 1.2.2

This module also has a [Twitter Bootstrap](http://getbootstrap.com/) support (tested with version 3.1.1).

Getting started
---------------

### Download

**Manually**

The files can be downloaded from:

* Minified [JS](https://raw.githubusercontent.com/l-lin/angular-datatables/master/dist/angular-datatables.min.js) and [CSS](https://raw.githubusercontent.com/l-lin/angular-datatables/master/dist/plugins/bootstrap/datatables.bootstrap.min.css) for production usage
* Un-minified [JS](https://raw.githubusercontent.com/l-lin/angular-datatables/master/dist/angular-datatables.js) and [CSS](https://raw.githubusercontent.com/l-lin/angular-datatables/master/dist/plugins/bootstrap/datatables.bootstrap.css) for development

> The CSS file only contains `Twitter Bootstrap` styles to support datatables.

**With Bower**

```
bower install angular-datatables
```

### Installation

Include the CSS, JS file in your `index.html` file:

```html
<script src="jquery.min.js"></script>
<script src="jquery.dataTables.min.js"></script>
<script src="angular.min.js"></script>
<script src="angular-datatables.min.js"></script>
<link rel="stylesheet" href="angular-datatables.css">
```

**IMPORTANT**: You must include the JS in this order. AngularJS **MUST** use jQuery and not its jqLite!

If you want the `Twitter Bootstrap` support, then add the CSS file:

```html
<link href="datatables.bootstrap.min.css" rel="stylesheet">
```

Declare dependencies on your module app like this:

```html
angular.module('myModule', ['datatables']);
```

Usage
-----

See [github page](https://l-lin.github.io/angular-datatables).

Additional notes
----------------

* [RequireJS](http://requirejs.org/) is not supported.
* A DataTable directive instance is created each time a DataTable is rendered.
 * You can use the directive `dt-instance` where you provide a variable that will be populated with the DataTable instance
once it's rendered:

```html
<table id="foobar" datatable dt-options="dtOptions" dt-columns="dtColumns" dt-instance="dtInstance"></table>
```

The `dtInstance` variable will be populated with the following value:

```json
{
    "id": "foobar",
    "DataTable": oTable,
    "dataTable": $oTable,
    "reloadData": function(callback, resetPaging),
    "changeData": function(newData),
    "rerender": function()
}
```

> DataTable is the DataTable API instance
> dataTable is the jQuery Object
> See http://datatables.net/manual/api#Accessing-the-API

For more information, please check the [documentation](http://l-lin.github.io/angular-datatables/#/dtInstances).

* `Angular Datatables` is using [Object.create()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/create) to instanciate options and columns.
  * If you need to support IE8, then you need to add this [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill).

* When providing the DT options, `Angular DataTables` will resolve every promises (except the attributes `data` and `aaData`) before rendering the DataTable.

For example, suppose we provide the following code:

```js
angular.module('yourModule')
.controller('MyCtrl', MyCtrl);

function MyCtrl($q, DTOptionsBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionBuilder.newOptions()
        .withOptions('autoWidth', fnThatReturnsAPromise);

    function fnThatReturnsAPromise() {
        var defer = $q.defer();
        defer.resolve(false);
        return defer.promise;
    }
}
```

The `fnThatReturnsAPromise` will first be resolved and then the DataTable will be rendered with the option `autoWidth` set to `false`.

Contributing
============

See [CONTRIBUTING](https://github.com/l-lin/angular-datatables/blob/dev/CONTRIBUTING.md).

License
================
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
