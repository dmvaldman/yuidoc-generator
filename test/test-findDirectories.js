/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var test = require('tape');
var path = require('path');

var fixtures = path.join(__dirname, 'fixtures');

var findDirectories = require('../lib/findDirectories');

test('findDirectories should work when required', function (t) {
  t.plan(1);
  t.ok(findDirectories, 'the returned value should exist');
});

test('findDirectories should return a list of directories in a folder', function (t) {
  t.plan(2);
  findDirectories(fixtures, function (err, list) {
    var expected = [
      fixtures,
      path.join(fixtures, 'physics'),
      path.join(fixtures, 'physics/baz'),
      path.join(fixtures, 'physics/integrators')
    ];
    t.notok(err, 'findDirectories should execute callback without an error');
    t.deepEqual(list.sort(), expected.sort(), 'It should return the expected list');
  });
});
