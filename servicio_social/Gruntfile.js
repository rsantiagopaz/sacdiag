// requires
var util = require('util');
var qx = require("../../../../qooxdoo-5.0.2-sdk/tool/grunt");

// grunt
module.exports = function(grunt) {
  var config = {

    generator_config: {
      let: {
      }
    },

    common: {
      "APPLICATION" : "servicio_social",
      "QOOXDOO_PATH" : "../../../../qooxdoo-5.0.2-sdk",
      "LOCALES": ["en"],
      "QXTHEME": "servicio_social.theme.Theme"
    }

    /*
    myTask: {
      options: {},
      myTarget: {
        options: {}
      }
    }
    */
  };

  var mergedConf = qx.config.mergeConfig(config);
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  // grunt.loadNpmTasks('grunt-my-plugin');
};
