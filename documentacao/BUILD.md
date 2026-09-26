# Build de produção

## Configuração

- esbuild 0.28.2: entrada js/main.js, bundle e minify ativos, formato esm, plataforma browser, sintaxe-alvo es2020. O alvo de sintaxe não adiciona polyfills de APIs do navegador.
- CSS: tokens.css antes de estilos.css, agrupados e minificados em app.css.
- html-minifier-terser 7.2.0: comentários removidos, espaços reduzidos conservadoramente; aspas dos atributos e tags opcionais preservadas.
- Imagens copiadas sem recompressão. A hierarquia html/css/js/imagens é preservada na saída.
- HTML dos templates JavaScript permanece nas strings; não há transformação manual de expressões regulares, ids, seletores, atributos ARIA ou nomes de propriedades.
- Dependências fixadas em package.json e package-lock.json. Instalação: npm.cmd ci. Build: npm.cmd run build.

## Medição em 25/09/2026

| Grupo | Antes (bytes) | Depois (bytes) | Redução |
|---|---:|---:|---:|
| HTML | 3426 | 2984 | 12,90% |
| CSS | 13110 | 10692 | 18,44% |
| JavaScript | 30722 | 22069 | 28,17% |
| Total | 47258 | 35745 | 24,36% |

Fórmula: (1 - depois/antes) × 100. A comparação é entre fontes HTML/CSS/JS e saída agrupada/minificada, excluindo imagens, dependências de desenvolvimento e compressão HTTP. O script gera BUILD-METRICAS.json novamente em cada execução. Diferenças de quebra de linha podem alterar os bytes dos fontes no Windows.

## Desafios tratados e verificação

Preservar os caminhos das imagens nos templates, a ordem de precedência do CSS e o comportamento dos módulos foi o foco desta configuração. Os arquivos foram agrupados por ferramentas próprias para as linguagens; não se removeu espaço de JavaScript com substituições manuais. O documento HTML aponta para o CSS agrupado, e o caminho js/main.js foi mantido na saída.

As suítes testes/navegador.cjs e testes/contraste.cjs passaram em Chromium headless com o servidor apontando para dist: rotas/histórico sem recarga, imagens, máscaras e validação, armazenamento, modal, alto contraste, recarga, sincronização, teclado e larguras responsivas. Não ocorreram erros JavaScript nos cenários monitorados.

Isso não garante equivalência para todos os navegadores e condições. Firefox, Safari e leitores de tela não foram verificados nesta etapa. Deploy e release permanecem pendentes.
