module.exports = {
    livereload: {
        options: {
            livereload: '<%= express.options.livereload %>'
        },
        files: [
            '<%= yeoman.currentDir %>',
            '<%= yeoman.demo %>/**/*.html',
            '<%= yeoman.demo %>/**/*.js',
            '<%= yeoman.styles %>/{,*/}*.css',
            '<%= yeoman.src %>/**/*.html',
            '<%= yeoman.src %>/**/*.js',
            '<%= yeoman.src %>/{,*/}*.css',
            '<%= yeoman.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    },
    test: {
        options: {
            livereload: {
                port: 35728
            }
        },
        files: [
            '<%= yeoman.src %>/{,*/}*.html',
            '<%= yeoman.src %>/{,*/}*.js',
            '<%= yeoman.test %>/**/*.js'
        ],
        tasks: ['test']
    }
};
