import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { readFile, writeFile, mkdir, rm, cp, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = fileURLToPath(new URL('../', import.meta.url));
process.chdir(raiz);
// Somente a pasta gerada é recriada. Os arquivos de desenvolvimento são preservados.
await rm('dist', { recursive: true, force: true });
await mkdir('dist/html', { recursive: true });
await mkdir('dist/css', { recursive: true });
await mkdir('dist/js', { recursive: true });
await build({ entryPoints: ['js/main.js'], bundle: true, minify: true,
  format: 'esm', platform: 'browser', target: 'es2020', outfile: 'dist/js/main.js' });
await build({ stdin: { contents: '@import "./tokens.css";\n@import "./estilos.css";',
  resolveDir: path.join(raiz, 'css'), loader: 'css' },
  bundle: true, minify: true, outfile: 'dist/css/app.css' });
const original = await readFile('html/index.html', 'utf8');
const html = original.replace(
  /<link rel="stylesheet" href="\.\.\/css\/tokens.css">\s*<link rel="stylesheet" href="\.\.\/css\/estilos.css">/,
  '<link rel="stylesheet" href="../css/app.css">');
if (html === original) throw new Error('Links CSS não encontrados. Revise a entrada HTML.');
await writeFile('dist/html/index.html', await minify(html, {
  collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
  removeAttributeQuotes: false, removeOptionalTags: false
}));
// Preserva a hierarquia: os templates usam ../imagens em relação a html/index.html.
await cp('imagens', 'dist/imagens', { recursive: true });
async function arquivos(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const nome = path.join(dir, item.name);
    result.push(...(item.isDirectory() ? await arquivos(nome) : [nome]));
  }
  return result;
}
async function bytes(lista) {
  return (await Promise.all(lista.map(async f => (await stat(f)).size))).reduce((a,b)=>a+b,0);
}
const grupos = [
  ['HTML', ['html/index.html'], ['dist/html/index.html']],
  ['CSS', ['css/tokens.css','css/estilos.css'], ['dist/css/app.css']],
  ['JavaScript', (await arquivos('js')).filter(f=>f.endsWith('.js')), ['dist/js/main.js']]
];
const medidas = [];
for (const [tipo,entrada,saida] of grupos) {
  const antes=await bytes(entrada), depois=await bytes(saida);
  medidas.push({tipo,antes,depois,reducaoPercentual:Number(((1-depois/antes)*100).toFixed(2))});
}
const antes=medidas.reduce((s,m)=>s+m.antes,0), depois=medidas.reduce((s,m)=>s+m.depois,0);
medidas.push({tipo:'Total HTML/CSS/JS',antes,depois,reducaoPercentual:Number(((1-depois/antes)*100).toFixed(2))});
await mkdir('documentacao',{recursive:true});
await writeFile('documentacao/BUILD-METRICAS.json', JSON.stringify({
  metodo:'Bytes em disco, sem gzip/Brotli; antes: fontes HTML/CSS/JS; depois: saída agrupada e minificada. Imagens excluídas.',medidas
},null,2)+'\n');
console.table(medidas);
console.log('Build pronta em dist/. Entrada: dist/html/index.html');
// Entrada pública na raiz, mantendo os caminhos relativos da aplicação em html/.
await writeFile('dist/index.html', '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=./html/index.html"><title>Raízes do Amanhã</title></head><body><p><a href="./html/index.html">Acessar Raízes do Amanhã</a></p></body></html>');
