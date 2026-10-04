/* Cloudflare Pages build: publish app files only, never the parent source folder. */
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'dist');
fs.mkdirSync(out, {recursive:true});
for (const name of ['index.html','css','js','data','assets','vendor','_headers']) {
  const src = path.join(root,name);
  if (!fs.existsSync(src)) throw new Error(`Missing build input: ${name}`);
  fs.cpSync(src,path.join(out,name),{recursive:true});
}
console.log('Static site built in dist/');
