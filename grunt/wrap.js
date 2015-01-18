module.exports = {
    options: {
        wrapper: ['<%= yeoman.wrapper.start %>', '<%= yeoman.wrapper.end %>']
    },
    advanced: {
        cwd: '<%= yeoman.build %>/',
        expand: true,
        src: ['**/*.js'],
        dest: '<%= yeoman.build %>/',
        options: {
            wrapper: ['<%= yeoman.wrapper.start %>', '<%= yeoman.wrapper.end %>']
        }
    }
};
