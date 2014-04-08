module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: {
            '<%= yeoman.dist %>/datatables.bootstrap.min.css': [
                '<%= yeoman.src %>/*.css'
            ]
        }
    }
};
