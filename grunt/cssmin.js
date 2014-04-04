module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: {
            '<%= yeoman.dist %>/angular-datatables.min.css': [
                '<%= yeoman.src %>/*.css'
            ]
        }
    }
};
