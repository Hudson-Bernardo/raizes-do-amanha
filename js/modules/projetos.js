// Fonte dos dados dos cartões. Cada objeto representa uma iniciativa da ONG.
// As imagens usam o mesmo nome-base nos formatos WebP e JPEG, na pasta imagens.
export const listaProjetos = [
  {
    "id": "educacao",
    "titulo": "Aprender para crescer",
    "categoria": "Educação",
    "descricao": "Oficinas de leitura, reforço escolar e introdução à tecnologia para ampliar possibilidades de aprendizagem.",
    "colaboracao": "Apoiar atividades educativas, organizar materiais e compartilhar conhecimentos.",
    "imagem": "educacao",
    "alt": "Uma voluntária acompanha duas crianças em uma atividade com livro e caderno."
  },
  {
    "id": "alimentacao",
    "titulo": "Mesa compartilhada",
    "categoria": "Segurança alimentar",
    "descricao": "Campanhas de arrecadação e organização de alimentos para fortalecer o apoio a famílias da comunidade.",
    "colaboracao": "Organizar doações, separar alimentos e ajudar na preparação das ações.",
    "imagem": "alimentacao",
    "alt": "Três voluntários organizam verduras e pacotes de alimentos em caixas."
  },
  {
    "id": "comunidade",
    "titulo": "Bairro que floresce",
    "categoria": "Cuidado coletivo",
    "descricao": "Mutirões de cuidado com espaços de convivência e oficinas de educação ambiental.",
    "colaboracao": "Participar dos mutirões, cuidar de hortas e incentivar práticas sustentáveis.",
    "imagem": "comunidade",
    "alt": "Três pessoas plantam mudas e regam um canteiro em uma horta comunitária."
  }
];

// Escapa textos antes de inseri-los no HTML, preservando acentos e pontuação.
function escaparHTML(valor) {
  const entidades = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(valor).replace(/[&<>"']/g, caractere => entidades[caractere]);
}

// Um único modelo mantém a estrutura e a acessibilidade de todos os cartões.
export function renderizarCartoes(projetos = listaProjetos) {
  return projetos.map(projeto => {
    const titulo = escaparHTML(projeto.titulo);
    const imagem = encodeURIComponent(projeto.imagem);
    const id = encodeURIComponent(projeto.id);
    return `<article class="cartao projeto">
      <!-- Imagem ilustrativa gerada por IA para a ONG fictícia. -->
      <figure><picture>
        <source srcset="../imagens/${imagem}.webp" type="image/webp">
        <img src="../imagens/${imagem}.jpg" alt="${escaparHTML(projeto.alt)}" width="1536" height="1024" loading="lazy">
      </picture><figcaption>Imagem para o projeto ${titulo}</figcaption></figure>
      <div class="miolo"><p class="badge">${escaparHTML(projeto.categoria)}</p>
        <h2>${titulo}</h2><p>${escaparHTML(projeto.descricao)}</p>
        <h3>Como colaborar</h3><p>${escaparHTML(projeto.colaboracao)}</p>
        <a class="link" href="#/cadastro?projeto=${id}">Quero participar <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join(''); // Une os cartões sem as vírgulas da conversão padrão de arrays.
}
