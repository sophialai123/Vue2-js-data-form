console.log = function () { };
const { assert } = require('chai');
const fs = require('fs');
const Structured = require('structured');

const code = fs.readFileSync('js/app.js', 'utf8');

describe('', function () {
  it("Did you specify the `el` property of your Vue app to be `'#app'`?", function () {
    let structure = function () {
      const app = new Vue({
        el: '#app'
      });
    };

    let isMatch = Structured.match(code, structure);
    assert.isOk(isMatch);
  });
});