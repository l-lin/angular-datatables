module.exports = {
    options: {
        banner: '<%= yeoman.banner %>'
    },
    dist: {
        files: [{
            expand: true,     // Enable dynamic expansion.
            cwd: '<%= yeoman.build %>/',      // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
            dest: '<%= yeoman.dist %>/',   // Destination path prefix.
            ext: '.min.js',   // Dest filepaths will have this extension.
            extDot: 'last'   // Extensions in filenames begin after the first dot
        }]
    }
};
