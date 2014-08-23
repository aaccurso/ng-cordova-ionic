#!/usr/bin/env node

var pluginlist = [
  'org.apache.cordova.console',
  'org.apache.cordova.device',
  'org.apache.cordova.network-information',
  'org.apache.cordova.file-transfer',
  'org.apache.cordova.statusbar',
  'org.apache.cordova.vibration',
  'org.apache.cordova.dialogs',
  'https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git'
];

var sys = require('sys');
var exec = require('child_process').exec;
var async = require('async');
var installPlugin = function (plugin, callback) {
  var puts = function (error, stdout, stderr) {
    sys.puts(stdout);
    callback();
  };
  exec('grunt plugin:add:' + plugin, puts);
};

async.eachSeries(pluginlist, installPlugin, function (err) {
  err && sys.puts(err);
  sys.puts('Plugin installation finished!');
});
