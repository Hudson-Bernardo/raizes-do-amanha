# Raízes do Amanhã

Projeto acadêmico de uma ONG fictícia, desenvolvido com HTML5, CSS3 e JavaScript puro. A aplicação apresenta a organização, divulga três iniciativas e oferece um formulário demonstrativo de participação.

A interface funciona como uma **Single Page Application (SPA)**: a navegação substitui o conteúdo principal sem recarregar todo o documento.

> Use somente dados fictícios. O cadastro é salvo localmente no navegador; não é enviado à ONG nem a um servidor.

## Funcionalidades

- Rotas de início, projetos e cadastro, com navegação por hash.
- Cartões de projetos gerados a partir de uma lista de objetos JavaScript.
- Menu mobile e submenu com controle por botão e fechamento com Escape.
- Formulário com validação nativa, máscaras de CPF, telefone e CEP e cálculo dos dígitos verificadores do CPF.
- Salvamento, recuperação e exclusão de um registro demonstrativo no localStorage.
- Mensagens de erro, confirmação e diálogo de exclusão.
- Layout responsivo com CSS Grid, Flexbox e cinco pontos de quebra.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura semântica, formulário, imagens e diálogo nativo |
| CSS3 | Variáveis, tipografia fluida, Grid, Flexbox e estados interativos |
| JavaScript / ES Modules | Templates, DOM, eventos, roteamento e validação |
| Web Storage e JSON | Persistência demonstrativa no navegador |
| Python 3 | Servidor HTTP para execução local |
| Node.js | Execução dos testes unitários com node:test |
| Playwright | Testes automatizados de navegador, opcionais na execução local |
| Git e GitHub | Histórico, branches e pull requests |

O site não depende de frameworks ou bibliotecas de terceiros em tempo de execução.

## Estrutura de diretórios

| Caminho | Conteúdo |
| --- | --- |
| `html/index.html` | Documento principal, navegação, área de conteúdo e componentes persistentes |
| `css/tokens.css` | Variáveis de cores, fontes e espaçamentos |
| `css/estilos.css` | Layout, componentes e responsividade |
| `imagens/` | Imagens ilustrativas em WebP e JPEG |
| `js/main.js` | Inicialização da aplicação |
| `js/modules/` | Módulos separados por responsabilidade |
| `testes/` | Testes unitários e de navegador |
| `capturas/` | Capturas produzidas durante testes de navegador |
| `documentacao/` | Documentos técnicos e resultados de verificações anteriores |
| `iniciar.py` | Servidor HTTP local |
| `INICIAR-WINDOWS.bat` | Atalho para iniciar o servidor no Windows |

## Pré-requisitos

Para abrir o site pelo servidor incluído:

- Python 3 instalado e disponível no terminal.
- Navegador moderno com JavaScript habilitado.
- Git, caso a obtenção do projeto seja feita por clonagem.

Para os testes unitários, utilize Node.js 20 ou superior, com npm. Playwright e Chromium são necessários somente para os testes de navegador.

## Instalação e execução local

### 1. Obter o projeto

```bash
git clone https://github.com/Hudson-Bernardo/raizes-do-amanha.git
cd raizes-do-amanha
git switch develop
```

A branch `develop` contém a integração das melhorias. Também é possível baixar seu ZIP pelo GitHub e extrair todos os arquivos.

### 2. Iniciar o servidor

No Windows, abra `INICIAR-WINDOWS.bat` com dois cliques ou execute na raiz do projeto:

```bash
py -3 iniciar.py
```

Em sistemas que utilizam o comando `python3`:

```bash
python3 iniciar.py
```

O navegador será aberto no endereço:

**http://127.0.0.1:8000/html/index.html**

Mantenha o terminal do servidor aberto durante o uso. Para encerrar, pressione `Ctrl+C`.

Não é necessário executar `npm install` para abrir o site ou rodar os testes unitários. Os módulos JavaScript são arquivos locais.

Não abra o HTML diretamente com `file://`: os ES Modules devem ser carregados por HTTP. Como alternativa, use um servidor como o Live Server do VS Code, servindo a raiz do projeto e acessando `html/index.html`.

### Problemas comuns

- **Python não encontrado:** confirme a instalação e reabra o terminal.
- **Porta 8000 ocupada:** encerre uma instância anterior do servidor e tente novamente.
- **Imagens ou módulos ausentes:** confira se a pasta inteira foi extraída e se a estrutura de diretórios foi preservada.
- **Conteúdo antigo após substituir arquivos:** recarregue a página ignorando o cache.

## Rotas e organização do JavaScript

| Rota | Tela |
| --- | --- |
| `#/inicio` | Apresentação institucional e contatos demonstrativos |
| `#/projetos` | Iniciativas e links de participação |
| `#/cadastro` | Formulário e gerenciamento do registro local |
| `#/cadastro?projeto=educacao` | Cadastro com projeto previamente selecionado |

O roteador escuta `hashchange`, consulta os templates e atualiza o elemento `main`. Também ajusta título, foco e indicação da rota atual. Uma rota desconhecida apresenta uma mensagem de página não encontrada.

| Módulo | Responsabilidade |
| --- | --- |
| `roteador.js` | Interpretação das rotas e ciclo de vida das telas |
| `templates.js` | Marcação das telas |
| `projetos.js` | Lista de iniciativas e geração dos cartões com map/join |
| `menu.js` | Menu mobile, submenu e interações por teclado |
| `validacao.js` | Máscaras e regras complementares de validação |
| `formulario.js` | Eventos, erros e integração com o armazenamento |
| `armazenamento.js` | Leitura, validação, gravação e exclusão dos dados locais |
| `feedback.js` | Notificações e confirmação de exclusão |

Os eventos específicos do formulário são removidos com AbortController ao sair da rota. Textos dos cartões são escapados antes da composição do HTML; dados digitados são apresentados com `value` e `textContent`.

Para adicionar uma iniciativa completa, atualize a lista em `projetos.js`, disponibilize suas imagens e ajuste também as opções do formulário, os valores aceitos pelo armazenamento e, quando aplicável, o submenu. A geração dos cartões já é baseada em dados; esses outros pontos ainda possuem opções explícitas.

## Testes

### Testes unitários

Na raiz do projeto:

```bash
npm test
```

A suíte possui oito testes que cobrem:

- Formatação de CPF, telefone e CEP e validação dos dígitos do CPF.
- Persistência apenas dos campos permitidos e exclusão da chave específica.
- Tratamento de registros corrompidos e falhas de armazenamento.
- Geração dos cartões, links de cadastro e textos alternativos.
- Renderização de uma iniciativa adicional em um cenário de teste.
- Escape de caracteres especiais nos textos dos cartões.

Os oito testes passaram na verificação da alteração dos cartões dinâmicos. Execute novamente após modificar essas funcionalidades.

### Testes de navegador

Antes de instalar as ferramentas, inclua `node_modules/` no `.gitignore` para não versionar dependências locais. Instale as ferramentas de teste na raiz:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Esses comandos exigem internet e instalam ferramentas locais de teste sem adicioná-las ao package.json. A versão não está fixada nesta configuração; para um ambiente reproduzível, será necessário versionar as dependências de desenvolvimento e seu lockfile.

Com o servidor Python ativo na porta 8000, abra outro terminal na raiz e execute:

```bash
node testes/navegador.cjs
```

O script verifica navegação, formulário, armazenamento, diálogo e diferentes larguras de tela. Também grava capturas na pasta `capturas/`, substituindo arquivos de mesmo nome. Usa dados fictícios e um contexto isolado de navegador.

Os relatórios existentes em `documentacao/` registram execuções anteriores; não representam automaticamente uma nova execução após cada alteração. A atualização dos cartões foi verificada por testes unitários e comparação estrutural do HTML, sem uma nova execução completa de navegador nessa alteração.

## Acessibilidade e responsividade

Recursos implementados incluem HTML semântico, textos alternativos, rótulos associados aos campos, link para pular ao conteúdo, foco visível, mensagens associadas por aria-describedby, indicação de erros com aria-invalid e estados do menu com aria-expanded.

O layout utiliza pontos de quebra em 480, 640, 768, 1024 e 1280 pixels, além de uma regra para preferência por movimento reduzido.

**A revisão completa de conformidade com WCAG 2.1 nível AA ainda está pendente.** A presença desses recursos e a execução de testes automatizados não comprovam, isoladamente, conformidade. Ainda devem ser documentadas verificações de contraste, teclado, ampliação, tecnologias assistivas e os demais critérios aplicáveis.

## Armazenamento e limitações

A chave `raizes-amanha:cadastro:v1` mantém um único registro com nome, e-mail, projeto, disponibilidade, mensagem e versão da estrutura. Um novo salvamento substitui o anterior.

CPF, telefone, nascimento e endereço não são persistidos. A leitura valida os dados recuperados e trata erros de JSON ou indisponibilidade do armazenamento. A exclusão utiliza `removeItem` somente na chave do projeto.

O registro fica restrito ao navegador e à origem utilizados. Não há sincronização entre dispositivos, autenticação, banco de dados remoto ou processamento de doações. O servidor Python serve arquivos estáticos e não recebe cadastros. Uma integração futura precisará de validação e controles de segurança no servidor.

## Versionamento e colaboração

O fluxo utiliza `main` para a base estável, `develop` para integração e branches `feature/` para melhorias. Os cartões dinâmicos foram implementados em `feature/projetos-dinamicos`, no commit `6f1f845`, e integrados à `develop` pelo [pull request #1](https://github.com/Hudson-Bernardo/raizes-do-amanha/pull/1).

As mensagens de implementação seguem o formato `tipo: descrição`, como:

- `feat: gera cartões de projetos a partir de dados`
- `docs: adiciona README com execução e testes` (mensagem sugerida para esta documentação)
- `fix: ...` para correções futuras.

Antes de integrar uma alteração, revise os arquivos e registre os testes realizados no pull request. Issues podem acompanhar tarefas e uma milestone pode agrupar os objetivos da entrega.

Para a preparação de uma versão, está previsto utilizar uma branch `release/`, concluir as verificações e integrar o resultado à `main` e à `develop`. Branches `hotfix/` serão utilizadas quando houver uma correção urgente em versão publicada.

A primeira release está planejada como `v1.0.0`. As versões seguirão MAJOR.MINOR.PATCH: mudanças incompatíveis, funcionalidades compatíveis e correções compatíveis. Essa convenção é um planejamento; uma tag ou release deve ser criada somente quando a entrega correspondente estiver pronta.

## Build e publicação

Atualmente, o projeto é estático e **não possui etapa de build, bundler ou comando npm run build**. O navegador utiliza diretamente HTML, CSS e módulos JavaScript.

O conjunto necessário para servir o site é formado pelas pastas `html`, `css`, `js` e `imagens`. O ponto de entrada é `html/index.html`, e os caminhos relativos dependem da preservação dessa estrutura.

Não há endereço de produção configurado nesta documentação. A otimização adicional, a configuração da hospedagem e a publicação serão realizadas na etapa de entrega. As imagens já possuem alternativas WebP/JPEG e os cartões utilizam carregamento tardio.

## Próximas etapas

- Revisar a acessibilidade e documentar resultados e limitações.
- Consolidar a configuração reproduzível dos testes de navegador.
- Avaliar otimização e preparar a hospedagem estática.
- Revisar a documentação da entrega.
- Criar a tag e a release correspondentes à versão publicada.

## Créditos e contexto acadêmico

A ONG, os contatos e as iniciativas são demonstrativos. As imagens utilizadas são ilustrações geradas por IA para o projeto fictício, conforme identificado nos comentários do código. Não representam ações documentadas de uma organização real.
