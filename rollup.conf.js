export default {
  input: 'index.js',
  output: {
    file: 'bundles/angular-datatables.umd.js',
    name: 'angular.datatables',
    globals: {
      '@angular/core': 'ng.core',
      '@angular/platform-browser': 'ng.platform-browser',
      '@angular/common': 'ng.common',
      'jquery': '$'
    },
    format: 'umd'
  },
  external: [
    '@angular/core',
    '@angular/platform-browser',
    '@angular/common',
    'rxjs',
    'jquery'
  ]
}
