module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.build %>',
            src: '*.js',
            dest: '<%= yeoman.build %>'
        }]
    }
};
