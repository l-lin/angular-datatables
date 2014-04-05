module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: {
            '<%= yeoman.dist %>/angular-datatables.min.js': [
                '<%= yeoman.build %>/angular-datatables.js'
            ]
        }
    }
};
