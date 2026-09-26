# Publicação com GitHub Pages

## Publicação confirmada

- Site: https://hudson-bernardo.github.io/raizes-do-amanha/html/index.html
- Repositório: https://github.com/Hudson-Bernardo/raizes-do-amanha
- Versão publicada: tag anotada `v1.0.0`.
- Integração: PR #7, de `release/v1.0.0` para `main`.
- Commit da publicação: `c5769fa`.
- Evidência: jobs `build` e `deploy` concluídos com sucesso; acesso ao site confirmado pelo responsável pelo projeto.
- A `develop` foi sincronizada com a `main` após a publicação.

A abertura do site não substitui a validação funcional completa no ambiente público.

## Configuração utilizada

Em Settings > Pages > Build and deployment, foi selecionado Source: GitHub Actions.
O workflow .github/workflows/pages.yml executa npm ci, npm test e npm run build em pushes e pull requests para develop/main. Publica dist somente a partir de main, depois do sucesso da build. Também aceita acionamento manual na main.

O job de publicação usa o ambiente github-pages, pages: write e id-token: write. Não exige token pessoal ou senha no código. O endereço efetivo é informado pelo resultado do deploy. O site só deve ser considerado publicado após o sucesso da execução e a verificação desse endereço.

O arquivo dist/index.html encaminha para ./html/index.html. Assim a aplicação mantém os caminhos relativos de CSS, JavaScript e imagens, inclusive dentro do prefixo do repositório. As rotas da SPA usam hash e não exigem reescrita no servidor.

## Fluxo de entrega

1. Integrar feature/deploy-pages à develop por pull request e verificar o job build.
2. Criar release/v1.0.0 a partir da develop validada.
3. Abrir pull request de release/v1.0.0 para main e revisar os testes.
4. Integrar à main para disparar a publicação.
5. Conferir Actions e o endereço fornecido pelo job deploy.
6. Testar início, projetos, cadastro, imagens e alto contraste na URL pública.
7. Sincronizar main/develop conforme o fluxo de release e registrar a tag somente após validar a entrega.

O pipeline executa os oito testes unitários. As suítes de navegador não estão automatizadas neste workflow. GitHub Pages hospeda apenas o front-end; o formulário continua demonstrativo e salva dados somente no navegador. Esta configuração não implementa back-end.

A build adiciona uma pequena página de entrada em dist/index.html. Ela é um arquivo auxiliar novo e não integra a comparação anterior de minificação dos fontes HTML/CSS/JS em BUILD-METRICAS.json.
