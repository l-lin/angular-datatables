import terser from '@rollup/plugin-terser';

export default {
  input: 'index.js',
  output: {
    file: 'bundles/angular-datatables.umd.min.js',
    format: 'umd',
    globals: {
      '@angular/core': 'ng.core',
      '@angular/platform-browser': 'ng.platform-browser',
      '@angular/common': 'ng.common'
    },
    name: 'angular.datatables',
    sourcemap: true
  },
  external: [
    '@angular/core',
    '@angular/platform-browser',
    '@angular/common',
    'rxjs',
    'jquery'
  ],
  plugins: [
    terser()
  ]
}
