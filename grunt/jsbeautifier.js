module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '<%= yeoman.build %>',
                '<%= yeoman.dist %>/*',
                '!<%= yeoman.dist %>/.git*'
            ]
        }]
    },
    server: '<%= yeoman.build %>'
};
