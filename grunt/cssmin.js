module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: {
            '<%= yeoman.dist %>/plugins/bootstrap/datatables.bootstrap.min.css': [
                '<%= yeoman.src %>/plugins/bootstrap/*.css'
            ]
        }
    }
};
