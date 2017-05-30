import uglify from 'rollup-plugin-uglify';

export default {
    entry     : 'index.js',
    dest      : 'bundles/angular-datatables.umd.min.js',
    format    : 'umd',
    external  : [
        '@angular/core',
        '@angular/platform-browser',
        '@angular/common'
    ],
    globals   : {
        '@angular/core': 'ng.core',
        '@angular/platform-browser': 'ng.platform-browser',
        '@angular/common': 'ng.common'
    },
    moduleName: 'angular.datatables',
    plugins: [
        uglify()
    ]
}
