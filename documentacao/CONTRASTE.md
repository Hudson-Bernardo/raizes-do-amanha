# Alto contraste — verificação em 25/09/2026

Implementado botão no cabeçalho com aria-pressed, seleção por data-contraste, variáveis CSS, persistência independente e tratamento de indisponibilidade do localStorage. Não há tema escuro separado.

## Pares medidos

Ferramenta: Python, luminância relativa sRGB e razão (Lmaior + 0,05)/(Lmenor + 0,05). Execute `python testes/contraste-cores.py`.

| Elemento | Texto / fundo | Razão |
|---|---|---|
| Texto principal, secundário, formulário e rodapé | #FFFFFF / #000000 | 21,00:1 |
| Botão principal | #000000 / #FFFF00 | 19,56:1 |
| Botão principal em hover | #000000 / #FFFFFF | 21,00:1 |
| Badge e botão secundário | #FFFF00 / #000000 | 19,56:1 |
| Mensagem de erro | #FFB3B3 / #000000 | 12,35:1 |
| Contorno de foco sobre o fundo | #00FFFF / #000000 | 16,75:1 |

Os cálculos cobrem os pares opacos indicados, não fotografias, controles desabilitados ou todas as combinações renderizadas. O foco usa outline-offset para ficar separado do botão.

## Verificações executadas

- `npm test`: oito testes unitários aprovados.
- `node testes/contraste.cjs`: aprovado em Chromium headless; Enter/Espaço, estado aria-pressed, cores de body, navegação, recarga, sincronização entre abas, armazenamento bloqueado e larguras 360/768/1440.
- `node testes/navegador.cjs`: suíte existente aprovada, incluindo formulário, persistência, modal, navegação e 36 verificações de largura.
- Inspeção visual de captura mobile do formulário; removidas transições de cor no alto contraste para evitar estados intermediários pouco legíveis.

Os testes de navegador exigem Playwright e Chromium, conforme o README, e servidor ativo na porta 8000. Execute-os em ambiente de teste com dados fictícios.

Não foram executados testes com NVDA/VoiceOver, Firefox ou Safari. Esta verificação não é uma declaração de conformidade completa com WCAG 2.1 AA.
