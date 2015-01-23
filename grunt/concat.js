module.exports = {
    options: {
        stripBanners: true,
        banner: '<%= yeoman.banner %>'
    },
    build: {
        options: {
            stripBanners: true,
            banner: ''
        },
        files: {
            '<%= yeoman.build %>/angular-datatables.js': ['<%= yeoman.src %>/*.js'],
            '<%= yeoman.build %>/plugins/bootstrap/angular-datatables.bootstrap.js': ['<%= yeoman.src %>/plugins/bootstrap/*.js'],
            '<%= yeoman.build %>/plugins/colreorder/angular-datatables.colreorder.js': ['<%= yeoman.src %>/plugins/colreorder/*.js'],
            '<%= yeoman.build %>/plugins/columnfilter/angular-datatables.columnfilter.js': ['<%= yeoman.src %>/plugins/columnfilter/*.js'],
            '<%= yeoman.build %>/plugins/colvis/angular-datatables.colvis.js': ['<%= yeoman.src %>/plugins/colvis/*.js'],
            '<%= yeoman.build %>/plugins/scroller/angular-datatables.scroller.js': ['<%= yeoman.src %>/plugins/scroller/*.js'],
            '<%= yeoman.build %>/plugins/tabletools/angular-datatables.tabletools.js': ['<%= yeoman.src %>/plugins/tabletools/*.js'],
            '<%= yeoman.build %>/plugins/fixedcolumns/angular-datatables.fixedcolumns.js': ['<%= yeoman.src %>/plugins/fixedcolumns/*.js'],
            '<%= yeoman.build %>/plugins/fixedheader/angular-datatables.fixedheader.js': ['<%= yeoman.src %>/plugins/fixedheader/*.js']
        }
    },
    // Copy the source files with the banner in dist folder
    banner: {
        files: {
            '<%= yeoman.dist %>/angular-datatables.js': ['<%= yeoman.build %>/angular-datatables.js'],
            '<%= yeoman.dist %>/plugins/bootstrap/angular-datatables.bootstrap.js': ['<%= yeoman.build %>/plugins/bootstrap/angular-datatables.bootstrap.js'],
            '<%= yeoman.dist %>/plugins/colreorder/angular-datatables.colreorder.js': ['<%= yeoman.build %>/plugins/colreorder/angular-datatables.colreorder.js'],
            '<%= yeoman.dist %>/plugins/columnfilter/angular-datatables.columnfilter.js': ['<%= yeoman.build %>/plugins/columnfilter/angular-datatables.columnfilter.js'],
            '<%= yeoman.dist %>/plugins/colvis/angular-datatables.colvis.js': ['<%= yeoman.build %>/plugins/colvis/angular-datatables.colvis.js'],
            '<%= yeoman.dist %>/plugins/scroller/angular-datatables.scroller.js': ['<%= yeoman.build %>/plugins/scroller/angular-datatables.scroller.js'],
            '<%= yeoman.dist %>/plugins/tabletools/angular-datatables.tabletools.js': ['<%= yeoman.build %>/plugins/tabletools/angular-datatables.tabletools.js'],
            '<%= yeoman.dist %>/plugins/fixedcolumns/angular-datatables.fixedcolumns.js': ['<%= yeoman.build %>/plugins/fixedcolumns/angular-datatables.fixedcolumns.js'],
            '<%= yeoman.dist %>/plugins/fixedheader/angular-datatables.fixedheader.js': ['<%= yeoman.build %>/plugins/fixedheader/angular-datatables.fixedheader.js']
        }
    },
    bannerCSS: {
        src: ['<%= yeoman.src %>/plugins/bootstrap/datatables.bootstrap.css'],
        dest: '<%= yeoman.dist %>/plugins/bootstrap/datatables.bootstrap.css'
    }
};
