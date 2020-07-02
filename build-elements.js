const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/angular-table-element/scripts.js',
    './dist/angular-table-element/main.js'
  ];

  await fs.ensureDir('../../Express-Screen/src/assets');
  await concat(files, '../../Express-Screen/src/assets/tra-table.js');
})();