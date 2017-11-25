export default {
    entry     : 'index.js',
    dest      : 'bundles/angular-datatables.umd.js',
    format    : 'umd',
    external  : [
        '@angular/core',
        '@angular/platform-browser',
        '@angular/common',
        'rxjs/Subject',
        'jquery'
    ],
    globals   : {
        '@angular/core': 'ng.core',
        '@angular/platform-browser': 'ng.platform-browser',
        '@angular/common': 'ng.common',
        'jquery': '$'
      },
    moduleName: 'angular.datatables'
}
