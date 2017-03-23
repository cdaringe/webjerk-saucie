'use strict'

var set = require('lodash/set')
var saucie = require('saucie')
var pidFile = 'sc_client.pid'

module.exports = function (config) {
  if (!config) throw new Error('missing config')
  set(config, 'pre.saucie', function sauciePre (config) {
    var opts = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      verbose: true,
      logger: console.log,
      pidfile: pidFile
    }

    var buildNumber = process.env.TRAVIS_JOB_NUMBER || process.env.CI_BUILD_NUMBER || process.env.BUILD_NUMBER
    if (buildNumber) opts.tunnelIdentifier = buildNumber

    return saucie.connect(opts)
  })
  set(config, 'post.saucie', function sauciePost (config) {
    return saucie.disconnect(pidFile)
  })
}
