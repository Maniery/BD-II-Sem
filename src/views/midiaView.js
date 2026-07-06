const { renderLayout } = require('./layout');

function renderCatalogo(midias, statusHTML, tipoFiltro, anoFiltro) {
    let cardsHtml = midias.map(m => `
        <div class="card" onclick="abrirDetalhes(this, event)" 
             data-titulo="${m.titulo}" data-ano="${m.ano}" data-tipo="${m.tipo}" data-genero="${m.genero}" 
             data-poster="${m.poster}" data-sinopse="${m.sinopse}" data-diretor="${m.diretor}" 
             data-atores="${m.atores}" data-rating="${m.imdbRating}" data-classificacao="${m.classificacao || 'Livre (L)'}">
            <form action="/deletar/${m._id}" method="POST" onsubmit="return confirmarExclusao(event)" style="margin:0;">
                <button type="submit" class="btn-delete" title="Remover">🗑️</button>
            </form>
            <img src="${m.poster}" alt="Poster">
            <div class="card-body">
                <div><span class="tag">${m.tipo}</span><h3 style="margin: 12px 0 6px 0;">${m.titulo}</h3></div>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size:14px;">Ano: <strong>${m.ano}</strong></p>
            </div>
        </div>
    `).join('');

    if (midias.length === 0) {
        cardsHtml = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">Catálogo vazio. Adicione mídias na aba de busca!</div>`;
    }

    const htmlConteudo = `
        <div class="container">
            <div class="hero"><h1>Catálogo de <span>Streaming</span></h1>${statusHTML}</div>
            <form method="GET" action="/" class="filter-bar">
                <select name="tipo">
                    <option value="">Todos</option>
                    <option value="Filme" ${tipoFiltro === 'Filme' ? 'selected' : ''}>Filmes</option>
                    <option value="Série" ${tipoFiltro === 'Série' ? 'selected' : ''}>Séries</option>
                </select>
                <input type="number" name="ano" placeholder="Ano" value="${anoFiltro || ''}">
                <button type="submit">FILTRAR</button>
            </form>
            <div class="grid">${cardsHtml}</div>
        </div>
    `;
    return renderLayout(htmlConteudo);
}

function renderBusca(listaResultadosHtml, queryBusca) {
    const htmlConteudo = `
        <div class="container"><div class="form-box"><h2>🔍 Busca Ampla por Aproximação</h2>
        <form action="/adicionar" method="GET"><input type="text" name="busca" placeholder="Ex: Star Wars..." value="${queryBusca || ''}" required><button type="submit" class="btn">PROCURAR</button></form>
        <div class="search-results">${listaResultadosHtml}</div></div></div>
    `;
    return renderLayout(htmlConteudo);
}

function renderTeoria() {
    const htmlConteudo = `
        <div class="container"><div class="form-box" style="text-align:left; max-width:800px;">
            <h1>Relatório de Arquitetura Modularizada</h1>
            <p><strong>Desenvolvedor:</strong> Laety Maniery de Araújo Batista</p><hr style="border:0; border-top:1px solid #334155;">
            <h3>Padrões Arquiteturais Aplicados</h3>
            <p>A aplicação foi totalmente desacoplada seguindo a arquitetura <strong>MVC (Model-View-Controller)</strong> adaptada. O roteador funciona como controlador de requisições, as Views gerenciam as estruturas visuais estruturadas, o service gerencia as conexões e os helpers executam tarefas específicas em segundo plano.</p>
        </div></div>
    `;
    return renderLayout(htmlConteudo);
}

module.exports = { renderCatalogo, renderBusca, renderTeoria };