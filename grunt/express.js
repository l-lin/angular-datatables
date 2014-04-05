module.exports = {
    options: {
        port: 9000,
        hostname: '127.0.0.1',
        livereload: 35729
    },
    livereload: {
        options: {
            open: true,
            bases: '<%= yeoman.currentDir %>',
            server: 'server/server'
        }
    },
    test: {
        options: {
            port: 9001,
            bases: [
                'test',
                '<%= yeoman.src %>'
            ]
        }
    }
};
