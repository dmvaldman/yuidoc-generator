/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var path = require('path');
var fs = require('fs');

var test = require('tape');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var templateBuilder = require('../lib/templateBuilder');
var yuiRunner = require('../lib/yuiRunner');
var yuiSanitizer = require('../lib/yuiSanitizer');

var inPath = path.join(__dirname, 'fixtures');
var outPath = path.join(process.env.TMPDIR || __dirname, 'famous-doc-generator', 'test-templateBuilder');
var templatePath = path.join(__dirname, '../templates/doc.jade');

test('setup templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  mkdirp.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.ok(exists, 'The output path folder should have been created in $TMPDIR');
  });
});

test('Make sure templateBuilder / yuiSanitizer / yuiRunner loads', function (t) {
  t.ok(templateBuilder, 'templateBuilder should exist after being required');
  t.end();
});

test('Make sure templateBuilder actually builds templates', function (t) {
  t.plan(4);
  var options = {
    baseDirectory: inPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }]
  };
  yuiRunner(options, function(json) {
    t.equal(typeof json, 'object', 'yuiRunner should return a valid object');
    yuiSanitizer(options, json);
    t.equal(typeof json, 'object', 'yuiSanitizer should return a valid object');

    templateBuilder(options, json, function (err) {
      t.notok(err, 'templateBuilder should finish without an error');
      var dirs = fs.readdirSync(outPath);
      t.deepEqual(dirs, ['Entity.html'], 'templateBuilder should create an Entity.html file');
    });
  });
});

test('teardown templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});
