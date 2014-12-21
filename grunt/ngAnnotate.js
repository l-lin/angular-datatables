module.exports = {
    options: {
        add: true,
        singleQuotes: true,
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.build %>',
            src: 'angular-datatables.js',
            dest: '<%= yeoman.build %>'
        }]
    }
};
