module.exports = function(grunt) {
    
    var root_dir = 'root/static/js/';
    var js_dir = 'pages/ia_pages/js/';
    var static_js_dir = 'pages/static_pages/js/';

    // tasks that run after diff
    // to release a new version
    var release_tasks = [
        'build',
        'version:release',
        'removelogging',
        'uglify:js',
        'remove',
        'gitcommit:ia_pages'
    ];

    // tasks that run when building
    var build_tasks = [
        'handlebars:compile',
        'compass',
        'concat:ia_pages',
        'concat:static_pages',
        'exec:copy_static_css',
        'exec:copy_static_js',
        'exec:copy_ia_css',
    ];

    var ia_page_js = [
        'handlebars_tmp',
        'DDH.js',
        'IAIndex.js',
        'IAPage.js',
        'ready.js'
    ];

    for( var file in ia_page_js ){
        ia_page_js[file] = js_dir + ia_page_js[file];
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        root_dir: root_dir,
        js_dir: js_dir,
        static_js_dir: static_js_dir,

        release_tasks: release_tasks,

        /*
         * increases the version number in package.json
         */
        version: {
            release: {
                options: {
                    release: 'minor'
                },
                src: ['package.json']
            }
        },

        /*
         * concat js files in js_dir and copy to root_dir
         */
        concat: {
            ia_pages:{
                src: ia_page_js,
                dest: root_dir + 'ia.js'
            },
            static_pages:{
                src: static_js_dir + '*.js',
                dest: root_dir + 'ddgc.js'
            }

        },

        /*
         * Compiles handlebar templates and add to Handlebars.templates namespace
         */
        handlebars: {
            compile: {
                options: {
                    namespace: "Handlebars.templates",
                    processName: function(filepath) {
                        var parts = filepath.split('/');
                        return parts[parts.length - 1].replace('.handlebars','');
                    }
                },
                files: {
                    '<%= js_dir %>/handlebars_tmp' : '<%= js_dir %>/*.handlebars'
                }
            }
        },

        /*
         * uglify ia.js and give it a version number for release
         */
        uglify: {
            js: {
                files: {
                    '<%= root_dir + "ia" +  pkg.version %>.js': root_dir + 'ia.js', 
                    '<%= root_dir + "ddgc" +  pkg.version %>.js': root_dir + 'ddgc.js' 
                }
            }
        },

        remove: {
            default_options: {
                trace: true,
                fileList: [ root_dir + 'ia.js', js_dir + 'handlebars_tmp', root_dir + 'ddgc.js']
            }
        },

        /*
         * for release check ia.js to see if it has changed.  If true then
         * run the tasks.  If not then stop here.
         */
        diff: {
            ia_js: {
                src: [ ],
               // src: [ root_dir + 'ia.js'],
                tasks: release_tasks
            }
        },

        /*
         * commits the ia.js version file and package.json
         * still needs to be pushed
         */
        gitcommit: {
            ia_pages: {
                options: {
                    message: 'Release IA pages version: <%= pkg.version %>'
                },
                files: {
                    src: [ root_dir + 'ia<%= pkg.version %>.js', 'package.json',  root_dir + 'ddgc<%= pkg.version %>.js']
                }
            }
        
        },

        /*
         * removes console.log
         */
        removelogging: {
            dist: {
                src: root_dir + 'ia.js'
            }
        },

        compass: {
            dist: {
                options: {
                    cssDir: 'pages/ia_pages/css'
                }
            }
        },

        exec: {
            copy_static_css: {
                command: 'mkdir -p root/static/css && cp -rf pages/static_pages/css/* root/static/css/'
            },
            copy_static_js: {
                command: 'mkdir -p root/static/js && cp -rf pages/static_pages/js/libraries/* root/static/js/'
            },
            copy_ia_css: {
                command: 'mkdir -p root/static/css && cp -rf pages/ia_pages/css/* root/static/css/'
            }
        }
    });

        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-handlebars');
        grunt.loadNpmTasks('grunt-version');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-diff');
        grunt.loadNpmTasks('grunt-remove');
        grunt.loadNpmTasks('grunt-git');
        grunt.loadNpmTasks('grunt-remove-logging');
        grunt.loadNpmTasks('grunt-contrib-compass');
        grunt.loadNpmTasks('grunt-exec');

        // check diff on ia.js.  Diff runs rest
        // of release process if the file has changed
        grunt.registerTask('release', release_tasks);

        // compile handlebars and concat js files
        // to ia.js
        grunt.registerTask('build', build_tasks);
}
