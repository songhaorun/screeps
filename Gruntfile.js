module.exports = function (grunt) {
  var config = require('./.screeps.json')
  var branch = grunt.option('branch') || config.branch;
  var email = grunt.option('email') || config.email;
  var password = grunt.option('password') || config.password;
  var ptr = grunt.option('ptr') ? true : config.ptr

  grunt.loadNpmTasks('grunt-screeps')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.initConfig({
    screeps: {
      options: {
        email: email,
        password: password,
        branch: branch,
        ptr: ptr
      },
      dist: {
        src: ['dist/*.js']
      }
    },

    // 移除 dist 文件夹中的所有文件。
    clean: {
      'dist': ['dist']
    },

    // 将所有源文件复制到 dist 文件夹中并展平文件夹结构
    copy: {
      // 将游戏代码推送到dist文件夹，以便在将其发送到 screeps 服务器之前可以对其进行修改。
      screeps: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'dist/',
          filter: 'isFile',
          rename: function (dest, src) {
            // 通过将文件夹分隔符替换成下划线来重命名文件
            return dest + src.replace(/\//g, '_');
          }
        }],
      }
    }
  });

  grunt.registerTask('default', ['clean', 'copy:screeps', 'screeps']);
}