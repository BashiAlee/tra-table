const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/angular-table-element/scripts.js',
    './dist/angular-table-element/main.js'
  ];

  await fs.ensureDir('../../Packages');
  await concat(files, '../../TRA-table/New-folder/tra-table.js');
})();