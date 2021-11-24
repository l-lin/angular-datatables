export enum ADTStyleOptions {
  DT="dt",
  BS3="bs3",
  BS4="bs4",
  BS5="bs5",
}

export const ADT_SUPPORTED_STYLES = [
  {
    style: ADTStyleOptions.DT,
    packageJson: [
      { version: '^1.11.3', name: 'datatables.net-dt', isDev: false },
    ],
    angularJson: [
      { path: 'node_modules/datatables.net-dt/css/jquery.dataTables.min.css', target: 'styles', fancyName: 'DataTables.net Core CSS' },
    ]
  },
  {
    style: ADTStyleOptions.BS3,
    packageJson: [
      { version: '^1.11.3', name: 'datatables.net-bs', isDev: false },
    ],
    angularJson: [
      { path: 'node_modules/datatables.net-bs/css/dataTables.bootstrap.min.css', target: 'styles', fancyName: 'DataTables.net Bootstrap 3 CSS' },
      { path: 'node_modules/datatables.net-bs/js/dataTables.bootstrap.min.js', target: 'scripts', fancyName: 'DataTables.net Bootstrap 3 JS' },
    ]
  },
  {
    style: ADTStyleOptions.BS4,
    packageJson: [
      { version: '^1.11.3', name: 'datatables.net-bs4', isDev: false },
    ],
    angularJson: [
      { path: 'node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css', target: 'styles', fancyName: 'DataTables.net Bootstrap 4 CSS' },
      { path: 'node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js', target: 'scripts', fancyName: 'DataTables.net Bootstrap 4 JS' },
    ]
  },
  {
    style: ADTStyleOptions.BS5,
    packageJson: [
      { version: '^1.11.3', name: 'datatables.net-bs5', isDev: false },
    ],
    angularJson: [
      { path: 'node_modules/datatables.net-bs5/css/dataTables.bootstrap5.min.css', target: 'styles', fancyName: 'DataTables.net Bootstrap 5 CSS' },
      { path: 'node_modules/datatables.net-bs5/js/dataTables.bootstrap5.min.js', target: 'scripts', fancyName: 'DataTables.net Bootstrap 5 JS' },
    ]
  },
]
