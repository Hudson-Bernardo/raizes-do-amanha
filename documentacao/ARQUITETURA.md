# Arquitetura e decisões

A aplicação utiliza JavaScript nativo, sem framework ou etapa de compilação.
O cabeçalho, o rodapé, o toast e o dialog permanecem no documento. O roteador
substitui somente os filhos de main a partir de templates conhecidos.

## Navegação

O fragmento da URL identifica a tela. hashchange trata alterações e histórico.
O roteador atualiza o título, a página atual, o foco e a posição de rolagem.
Rotas desconhecidas exibem uma mensagem e um link de retorno. Links de projetos
usam #/cadastro?projeto=... e permitem apenas as opções disponíveis no select.
Os antigos projetos.html e cadastro.html foram substituídos por rotas.

## Eventos e DOM

main.js inicializa os componentes persistentes uma vez. O formulário utiliza
AbortController para remover seus eventos ao sair da tela. Assim, voltar à
rota não acumula handlers. innerHTML recebe somente templates estáticos locais;
valores do armazenamento e da entrada do usuário usam value ou textContent.

## Validação e persistência

As funções puras de validacao.js tratam máscaras e dígitos verificadores.
O formulário combina required, pattern e type com checkValidity,
reportValidity e setCustomValidity. Erros aparecem próximos aos controles,
com aria-describedby e aria-invalid. No envio inválido, o primeiro campo
recebe o foco. Datas futuras e textos obrigatórios só com espaços são rejeitados.

Após validação, armazenamento.js grava a chave raizes-amanha:cadastro:v1.
A lista de campos persistidos é explícita. JSON inválido, esquema inesperado,
bloqueio e falha de gravação são tratados sem confirmação falsa. A exclusão
usa removeItem apenas na chave do projeto, nunca localStorage.clear().
O registro é único: salvar novamente substitui o cadastro demonstrativo anterior.

## Design System

Cores semânticas: fundo, papel, texto, verde, muted, linha, destaque, erro,
hover, foco, sucesso, erro-fundo, rodape e borda-controle.
Sete níveis de tamanho de fonte e uma escala de espaçamento em múltiplos de
0.25rem. Com fonte-base de 16px, a unidade corresponde a 4px.

As grades utilizam repeat(12, minmax(0, 1fr)). Em celulares, os componentes
ocupam 12 trilhas; campos passam a 6 em 640px; cartões passam a 6 em 768px
e a 4 em 1024px. Painel/formulário passam a 4/8 em 1024px.
O breakpoint de 480px amplia margens e preenchimentos, e 1280px amplia
as distâncias e o limite do contêiner. Flexbox trata as áreas internas.

## Componentes e acessibilidade

O menu possui botão com aria-controls e aria-expanded; o submenu abre por
clique ou teclado e fecha por Escape ou clique externo. O atraso curto no
tratamento de focusout permite concluir a transferência de foco antes de
verificar se o usuário deixou o submenu.

O modal nativo dialog contém o foco e permite Escape. Cancelar não exclui.
O toast usa role=status, pode ser dispensado e acompanha uma mensagem
persistente no formulário. O foco visível, as mensagens de erro e o contraste
fazem parte do projeto. prefers-reduced-motion desativa as transições.
Esses recursos não equivalem a certificação formal de acessibilidade.
