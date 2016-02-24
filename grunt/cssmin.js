module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: {
            '<%= yeoman.dist %>/plugins/bootstrap/datatables.bootstrap.min.css': [
                '<%= yeoman.src %>/plugins/bootstrap/*.css'
            ],
            '<%= yeoman.dist %>/css/angular-datatables.min.css': [
                '<%= yeoman.src %>/css/*.css'
            ]
        }
    }
};
