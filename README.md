# Angular DataTables [![Build Status](https://travis-ci.org/l-lin/angular-datatables.png?branch=master)](https://travis-ci.org/l-lin/angular-datatables) [![npm version](https://badge.fury.io/js/angular-datatables.svg)](https://badge.fury.io/js/angular-datatables) [![Maintainers Wanted](https://img.shields.io/badge/maintainers-wanted-red.svg)](https://github.com/pickhardt/maintainers-wanted)

> [Angular](https://angular.io/) + [DataTables](https://datatables.net/)

# Usage

Step 1:
```
ng add angular-datatables
```
Step 2:

Import `DataTablesModule` to your required module in your project.

# Documentation

Please check the [online documentation](http://l-lin.github.io/angular-datatables/)

# FAQ
## Why version 4.X? Where is version 3.X? And 1.X?

The major version of the project (it's using a [Semantic versioning](http://semver.org/)) will be synchronized with the major version of Angular.

## Why is there less functionality?

Because, I'm still working on it... But, if you want to contribute, feel free to make a pull request!

## Will you still work on version 0.X.Y?

Nope, not anymore!

## Why no BowerJS? GruntJS?

Let's not multiply the tools and do all in NPM! 

## Where are the DTOptionsBuilder, DTColumnBuilder and DTColumnDefBuilder?

In the first versions of angular-datatables, there is a builder to help with using the directive.
However, they seem to have brought more confusion instead. So, starting from version 2, you will need to provide the options directly, like in the DataTable's documentation.

# Getting involved

Check the [developer guide](DEVELOPER.md)

# LICENSE

[MIT](LICENSE)
