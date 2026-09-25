import { renderizarCartoes } from './projetos.js';

// Templates contêm somente HTML local. String.raw preserva as barras das expressões pattern.
// Dados digitados são apresentados com value/textContent, nunca interpolados como HTML.
const inicio = String.raw`<section class="hero" aria-labelledby="titulo-inicio">
      <div><p class="sobretitulo">Pequenas ações. Novos caminhos.</p>
      <h1 id="titulo-inicio">O amanhã começa com <em>gente que cuida.</em></h1>
      <p class="introducao">Conectamos pessoas e iniciativas para construir uma comunidade com mais oportunidades, acolhimento e dignidade.</p>
      <div class="acoes"><a class="botao" href="#/cadastro">Faça parte dessa mudança <span aria-hidden="true">↗</span></a><a class="link" href="#/inicio?secao=contato">Conheça nossos contatos</a></div></div>
      <!-- Imagem ilustrativa gerada por IA para a ONG fictícia. -->
      <figure><picture>
        <!-- WebP é a opção principal; JPEG funciona como alternativa. -->
        <source srcset="../imagens/capa.webp" type="image/webp">
        <img src="../imagens/capa.jpg" alt="Quatro voluntários organizam cadernos e mudas em uma mesa ao ar livre." width="1536" height="1024">
      </picture><figcaption>Pessoas unidas pelo cuidado com a comunidade</figcaption></figure>
    </section>
    <!-- Cada section agrupa um assunto e possui um título que identifica seu conteúdo. -->
    <section class="secao" aria-labelledby="sobre"><p class="sobretitulo">Quem somos</p><h2 id="sobre">Cultivar vínculos, transformar histórias.</h2><p class="texto-longo">A Raízes do Amanhã é uma ONG fictícia criada para este projeto acadêmico. Nossa proposta é aproximar voluntários e comunidades por meio de ações educativas, apoio alimentar e cuidado com espaços coletivos.</p>
      <div class="grade tres"><article class="cartao"><span class="numero">01</span><h3>Missão</h3><p>Promover oportunidades de desenvolvimento e fortalecer a participação comunitária.</p></article><article class="cartao"><span class="numero">02</span><h3>Visão</h3><p>Uma comunidade em que todas as pessoas possam aprender, contribuir e pertencer.</p></article><article class="cartao"><span class="numero">03</span><h3>Valores</h3><p>Respeito, solidariedade, inclusão e transparência em cada iniciativa.</p></article></div>
    </section>
    <section class="chamada" aria-labelledby="convite"><div><p class="sobretitulo">Seu tempo faz diferença</p><h2 id="convite">Todo talento pode abrir um caminho.</h2><p>Descubra como colaborar com as iniciativas da comunidade.</p></div><a class="botao" href="#/projetos">Explorar iniciativas</a></section>
    <!-- Contatos demonstrativos; substituir antes de um uso real. -->
    <section id="contato" class="secao" aria-labelledby="titulo-contato">
      <h2 id="titulo-contato">Entre em contato</h2>
      <p>Os dados abaixo são fictícios e não correspondem a canais reais de atendimento.</p>
      <address>
        <p><strong>E-mail:</strong> contato@raizesdoamanha.example</p>
        <p><strong>Telefone:</strong> (11) 0000-0000 — demonstrativo</p>
      </address>
      <p>Para experimentar o formulário de participação, <a href="#/cadastro">acesse o cadastro de demonstração</a>.</p>
    </section>
  `;

const projetos = String.raw`<section class="abertura" aria-labelledby="titulo-projetos"><p class="sobretitulo">Onde a mudança acontece</p><h1 id="titulo-projetos">Três iniciativas.<br><em>Um propósito em comum.</em></h1><p class="introducao">Conheça as propostas da ONG e encontre uma forma de contribuir.</p></section>
    <!-- article torna cada iniciativa uma unidade de conteúdo compreensível por si só. -->
    <div class="grade tres projetos">${renderizarCartoes()}</div><aside class="nota"><h2>Participação que respeita seu ritmo</h2><p>Escolha uma área de interesse no cadastro e indique sua disponibilidade. As iniciativas apresentadas são exemplos acadêmicos.</p></aside>
  `;

const cadastro = String.raw`<section class="abertura" aria-labelledby="titulo-cadastro"><p class="sobretitulo">Vamos construir juntos</p><h1 id="titulo-cadastro">Seu primeiro passo<br><em>para fazer parte.</em></h1><p class="introducao">Conte como você gostaria de contribuir.</p></section>
    <section class="salvos" aria-labelledby="titulo-salvos"><h2 id="titulo-salvos">Seu registro neste navegador</h2><p id="resumo-salvo">Nenhum registro salvo.</p><div class="acoes"><button type="button" class="botao secundario" id="recuperar" disabled>Recuperar dados salvos</button><button type="button" class="botao secundario" id="excluir" disabled>Excluir registro</button></div></section><div class="layout-cadastro"><aside class="painel"><h2>Tem lugar para você.</h2><p>Compartilhe conhecimentos, participe de ações solidárias ou ajude a cuidar da comunidade.</p><ol><li>Preencha seus dados.</li><li>Escolha uma iniciativa.</li><li>Valide seu cadastro de demonstração.</li></ol><p class="aviso">Use apenas dados fictícios. Nome, e-mail, projeto, disponibilidade e mensagem ficam neste navegador após a validação. CPF, telefone e endereço não são armazenados.</p></aside>
    <!-- O formulário usa required, type, pattern e limites nativos; o JS acrescenta máscaras e validação dos dígitos do CPF. -->
    <form id="formulario-cadastro">
      <p>Os campos com * são obrigatórios.</p>
      <noscript><p class="aviso">Ative o JavaScript para usar as máscaras e validar esta demonstração. O envio está desabilitado.</p></noscript>
      <fieldset><legend>01 · Dados pessoais</legend><div class="grade dois">
<div class="campo largura-total"><label for="nome">Nome completo *</label><input id="nome" name="nome" type="text" required minlength="3" maxlength="100" autocomplete="name"></div><div class="campo"><label for="email">E-mail *</label><input id="email" name="email" type="email" required maxlength="150" autocomplete="email"></div><div class="campo"><label for="nascimento">Data de nascimento *</label><input id="nascimento" name="nascimento" type="date" required autocomplete="bday"></div>
      <div class="campo"><label for="cpf">CPF *</label><input id="cpf" name="cpf" type="text" inputmode="numeric" required pattern="[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}" placeholder="000.000.000-00" aria-describedby="ajuda-cpf erro-cpf"><small id="ajuda-cpf">11 dígitos. A pontuação é aplicada automaticamente.</small><small id="erro-cpf" class="erro" aria-live="polite"></small></div>
      <div class="campo"><label for="telefone">Telefone com DDD *</label><input id="telefone" name="telefone" type="tel" inputmode="tel" required autocomplete="tel" pattern="\([1-9][0-9]\) (?:[2-5][0-9]{3}|9[0-9]{4})-[0-9]{4}" placeholder="(11) 90000-0000" aria-describedby="ajuda-telefone"><small id="ajuda-telefone">Fixo: 10 dígitos; celular: 11 dígitos.</small></div>
      </div></fieldset>
      <fieldset><legend>02 · Endereço</legend><div class="grade dois">
      <div class="campo"><label for="cep">CEP *</label><input id="cep" name="cep" type="text" inputmode="numeric" required autocomplete="postal-code" pattern="[0-9]{5}-[0-9]{3}" placeholder="00000-000" aria-describedby="ajuda-cep"><small id="ajuda-cep">8 dígitos. Informe o endereço manualmente.</small></div>
<div class="campo"><label for="logradouro">Logradouro *</label><input id="logradouro" name="logradouro" type="text" required maxlength="120" autocomplete="address-line1"></div><div class="campo"><label for="numero">Número *</label><input id="numero" name="numero" type="text" required maxlength="15" placeholder="Ex.: 123 ou S/N"></div><div class="campo"><label for="complemento">Complemento</label><input id="complemento" name="complemento" type="text" maxlength="80" autocomplete="address-line2"></div><div class="campo"><label for="bairro">Bairro *</label><input id="bairro" name="bairro" type="text" required maxlength="80"></div><div class="campo"><label for="cidade">Cidade *</label><input id="cidade" name="cidade" type="text" required maxlength="80" autocomplete="address-level2"></div><div class="campo"><label for="estado">Estado *</label><select id="estado" name="estado" required autocomplete="address-level1"><option value="">Selecione</option><option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option></select></div></div></fieldset>
      <fieldset><legend>03 · Como deseja participar?</legend><div class="grade dois"><div class="campo"><label for="projeto">Projeto de interesse *</label><select id="projeto" name="projeto" required><option value="">Selecione</option><option value="educacao">Aprender para crescer</option><option value="alimentacao">Mesa compartilhada</option><option value="comunidade">Bairro que floresce</option></select></div><div class="campo"><label for="disponibilidade">Disponibilidade *</label><select id="disponibilidade" name="disponibilidade" required><option value="">Selecione</option><option value="semana">Durante a semana</option><option value="fim-semana">Finais de semana</option><option value="eventual">Ações pontuais</option></select></div><div class="campo largura-total"><label for="mensagem">Como gostaria de ajudar? (opcional)</label><textarea id="mensagem" name="mensagem" rows="4" maxlength="500" placeholder="Conte um pouco sobre seus interesses e habilidades."></textarea><small>Até 500 caracteres.</small></div></div></fieldset>
      <label class="checkbox"><input id="ciencia" name="ciencia" type="checkbox" required> Entendo que este cadastro é demonstrativo e que parte dos dados fictícios será salva apenas neste navegador. *</label>
      <!-- Desabilitar o botão no HTML impede envio acidental caso o JavaScript não carregue. -->
      <div class="acoes"><button id="enviar" class="botao" type="submit" disabled>Validar e salvar</button><button class="botao secundario" type="reset">Limpar campos</button></div>
      <p id="resultado" class="resultado" role="status" tabindex="-1"></p>
    </form></div>
  `;

export function obterTemplate(rota) {
  const telas = { inicio, projetos, cadastro };
  return telas[rota] ?? `<section class="abertura"><h1>Página não encontrada</h1><p>O endereço não corresponde a uma área do projeto.</p><a class="botao" href="#/inicio">Voltar ao início</a></section>`;
}
