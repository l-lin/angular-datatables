module.exports = {
    options: {
        add: true,
        singleQuotes: true
    },
    dist: {
        files: {
            '<%= yeoman.build %>/angular-datatables.js': ['<%= yeoman.build %>/angular-datatables.js'],
            '<%= yeoman.build %>/plugins/bootstrap/angular-datatables.bootstrap.js': ['<%= yeoman.build %>/plugins/bootstrap/angular-datatables.bootstrap.js'],
            '<%= yeoman.build %>/plugins/colreorder/angular-datatables.colreorder.js': ['<%= yeoman.build %>/plugins/colreorder/angular-datatables.colreorder.js'],
            '<%= yeoman.build %>/plugins/columnfilter/angular-datatables.columnfilter.js': ['<%= yeoman.build %>/plugins/columnfilter/angular-datatables.columnfilter.js'],
            '<%= yeoman.build %>/plugins/colvis/angular-datatables.colvis.js': ['<%= yeoman.build %>/plugins/colvis/angular-datatables.colvis.js'],
            '<%= yeoman.build %>/plugins/scroller/angular-datatables.scroller.js': ['<%= yeoman.build %>/plugins/scroller/angular-datatables.scroller.js'],
            '<%= yeoman.build %>/plugins/tabletools/angular-datatables.tabletools.js': ['<%= yeoman.build %>/plugins/tabletools/angular-datatables.tabletools.js'],
            '<%= yeoman.build %>/plugins/fixedcolumns/angular-datatables.fixedcolumns.js': ['<%= yeoman.build %>/plugins/fixedcolumns/angular-datatables.fixedcolumns.js'],
            '<%= yeoman.build %>/plugins/fixedheader/angular-datatables.fixedheader.js': ['<%= yeoman.build %>/plugins/fixedheader/angular-datatables.fixedheader.js']
        }
    }
};
