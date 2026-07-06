const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios'); 

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONFIGURAÇÃO DO MONGODB LOCAL
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
const dbName = 'streaming_db';

let isCloudConnected = false;

let localBuffer = [
    { _id: "1", titulo: "Interestelar", ano: 2014, tipo: "Filme", genero: "Sci-Fi", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500", sinopse: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.", diretor: "Christopher Nolan", atores: "Matthew McConaughey, Anne Hathaway", imdbRating: "8.7" },
    { _id: "2", titulo: "A Origem", ano: 2010, tipo: "Filme", genero: "Action, Sci-Fi", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500", sinopse: "Um ladrão que rouba segredos corporativos por meio do uso de tecnologia de compartilhamento de sonhos.", diretor: "Christopher Nolan", atores: "Leonardo DiCaprio, Joseph Gordon-Levitt", imdbRating: "8.8" }
];

async function initDB() {
    try {
        await client.connect();
        isCloudConnected = true;
        console.log("🚀 [BANCO LOCAL] Conexão ativa com o MongoDB!");
    } catch (e) {
        isCloudConnected = false;
        console.log("⚠️ [ALERTA] Modo de Contingência Ativado (Memória Local).");
    }
}
initDB();

const CSS = `
<style>
    :root { --mongo-green: #00ED64; --mongo-dark: #001E2B; --bg: #020617; --card: #1e293b; --text: #f8fafc; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; }
    nav { background: var(--mongo-dark); padding: 1rem 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--mongo-green); position: sticky; top:0; z-index:100; }
    nav a { color: var(--text); text-decoration: none; font-weight: bold; margin-left: 20px; transition: 0.3s; }
    nav a:hover { color: var(--mongo-green); }
    .container { padding: 40px 5%; }
    .hero { text-align: center; margin-bottom: 30px; }
    .hero h1 { font-size: 3rem; margin: 0; color: #fff; }
    .hero span { color: var(--mongo-green); }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-top: 10px; }
    .status-badge.online { background: rgba(0, 237, 100, 0.15); color: #00ED64; border: 1px solid #00ED64; }
    .status-badge.offline { background: rgba(234, 88, 12, 0.15); color: #ea580c; border: 1px solid #ea580c; }
    
    .filter-bar { background: var(--card); padding: 15px 25px; border-radius: 12px; margin-bottom: 35px; border: 1px solid rgba(255,255,255,0.05); display: flex; gap: 15px; align-items: center; justify-content: center; }
    .filter-bar select, .filter-bar input { padding: 10px 15px; background: var(--bg); border: 1px solid #334155; color: white; border-radius: 6px; font-size: 14px; }
    .filter-bar button, .btn { background: var(--mongo-green); color: var(--mongo-dark); border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
    .btn:hover { opacity: 0.9; transform: scale(1.02); }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
    .card { background: var(--card); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; display: flex; flex-direction: column; cursor: pointer; position: relative; }
    .card:hover { transform: translateY(-10px); border-color: var(--mongo-green); box-shadow: 0 0 20px rgba(0,237,100,0.2); }
    .card img { width: 100%; height: 420px; object-fit: cover; background: #0f172a; }
    .card-body { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .tag { background: rgba(0,237,100,0.1); color: var(--mongo-green); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; align-self: flex-start; }
    
    .btn-delete { position: absolute; top: 15px; left: 15px; background: rgba(239, 68, 68, 0.9); border: none; color: white; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: 0.2s; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .btn-delete:hover { background: #ef4444; transform: scale(1.1); }

    .form-box { background: var(--card); padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid var(--mongo-green); text-align: center; }
    .form-box input { width: 100%; padding: 12px; margin: 15px 0; background: var(--bg); border: 1px solid #334155; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
    
    .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); backdrop-filter: blur(5px); align-items: center; justify-content: center; }
    .modal-content { background-color: var(--card); border: 2px solid var(--mongo-green); border-radius: 16px; width: 90%; max-width: 750px; display: grid; grid-template-columns: 280px 1fr; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .modal-close { position: absolute; top: 15px; right: 20px; color: #fff; font-size: 30px; font-weight: bold; cursor: pointer; z-index: 10; }
    .modal-left img { width: 100%; height: 100%; object-fit: cover; }
    .modal-right { padding: 30px; display: flex; flex-direction: column; gap: 12px; }
    .modal-rating { color: #f59e0b; font-weight: bold; display: flex; align-items: center; gap: 5px; }

    .search-results { display: flex; flex-direction: column; gap: 15px; margin-top: 30px; text-align: left; }
    .search-item { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1); }
    .search-item img { height: 70px; width: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
</style>
`;

const API_KEY = "3808cb61";

// ==========================================
// 1. ROTA PRINCIPAL: CATÁLOGO
// ==========================================
app.get('/', async (req, res) => {
    let midias = [];
    let statusHTML = `<span class="status-badge offline">💻 Modo Sandbox (Memória)</span>`;
    
    const { tipo, ano } = req.query;
    let queryFiltro = {};
    if (tipo) queryFiltro.tipo = tipo;
    if (ano) queryFiltro.ano = parseInt(ano);

    if (isCloudConnected) {
        try {
            const db = client.db(dbName);
            midias = await db.collection('midias').find(queryFiltro).sort({ _id: -1 }).toArray();
            statusHTML = `<span class="status-badge online">🟢 Conectado ao MongoDB Local</span>`;
        } catch (err) { midias = localBuffer; }
    } else {
        midias = localBuffer.filter(m => {
            if (tipo && m.tipo !== tipo) return false;
            if (ano && m.ano !== parseInt(ano)) return false;
            return true;
        });
    }

    let cardsHtml = midias.map(m => `
        <div class="card" onclick="abrirDetalhes(this, event)" 
             data-titulo="${m.titulo}" 
             data-ano="${m.ano}" 
             data-tipo="${m.tipo}" 
             data-genero="${m.genero}" 
             data-poster="${m.poster && m.poster !== 'N/A' ? m.poster : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500'}"
             data-sinopse="${m.sinopse || 'Sinopse não disponível.'}"
             data-diretor="${m.diretor || 'Não informado'}"
             data-atores="${m.atores || 'Não informado'}"
             data-rating="${m.imdbRating || 'N/A'}">
            
            <form action="/deletar/${m._id}" method="POST" onsubmit="return confirmarExclusao(event)" style="margin:0;">
                <button type="submit" class="btn-delete" title="Remover Filme">🗑️</button>
            </form>

            <img src="${m.poster && m.poster !== 'N/A' ? m.poster : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500'}" alt="Poster">
            <div class="card-body">
                <div>
                    <span class="tag">${m.tipo}</span>
                    <h3 style="margin: 12px 0 6px 0;">${m.titulo}</h3>
                </div>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size:14px;">Ano: <strong>${m.ano}</strong></p>
            </div>
        </div>
    `).join('');

    if (midias.length === 0) {
        cardsHtml = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">Nenhum título no catálogo. Vá em "Adicionar via API" para buscar!</div>`;
    }

    res.send(`
        ${CSS}
        <nav>
            <div><h2 style="margin:0; color:#fff;">Cine<span>Atlas</span> PRO</h2></div>
            <div><a href="/">Catálogo</a> <a href="/adicionar">Adicionar via API</a> <a href="/teoria">Tarefa S2</a></div>
        </nav>
        <div class="container">
            <div class="hero">
                <h1>Catálogo de <span>Streaming</span></h1>
                ${statusHTML}
            </div>

            <form method="GET" action="/" class="filter-bar">
                <select name="tipo">
                    <option value="">Todos os Tipos</option>
                    <option value="Filme" ${tipo === 'Filme' ? 'selected' : ''}>Filmes</option>
                    <option value="Série" ${tipo === 'Série' ? 'selected' : ''}>Séries</option>
                </select>
                <input type="number" name="ano" placeholder="Filtrar por Ano" value="${ano || ''}">
                <button type="submit">FILTRAR</button>
            </form>

            <div class="grid">${cardsHtml}</div>
        </div>

        <div id="meuModal" class="modal" onclick="fecharModalExterno(event)">
            <div class="modal-content">
                <span class="modal-close" onclick="fecharModal()">&times;</span>
                <div class="modal-left">
                    <img id="modalPoster" src="" alt="Poster">
                </div>
                <div class="modal-right">
                    <span id="modalTipo" class="tag"></span>
                    <h2 id="modalTitulo" style="margin: 5px 0;"></h2>
                    <div id="modalRating" class="modal-rating"></div>
                    <p id="modalSinopse" style="color: #cbd5e1; font-size: 15px; margin: 10px 0; line-height: 1.5;"></p>
                    <p style="font-size:14px; margin: 2px 0;">🎬 <strong>Diretor:</strong> <span id="modalDiretor" style="color:#64d2ff"></span></p>
                    <p style="font-size:14px; margin: 2px 0;">👥 <strong>Atores:</strong> <span id="modalAtores" style="color:#94a3b8"></span></p>
                    <p style="font-size:14px; margin: 2px 0;">🏷️ <strong>Gênero:</strong> <span id="modalGenero" style="color:#00ed64"></span></p>
                </div>
            </div>
        </div>

        <script>
            function abrirDetalhes(card, event) {
                if (event.target.closest('.btn-delete')) return;

                document.getElementById('modalPoster').src = card.getAttribute('data-poster');
                document.getElementById('modalTipo').innerText = card.getAttribute('data-tipo');
                document.getElementById('modalTitulo').innerText = card.getAttribute('data-titulo') + " (" + card.getAttribute('data-ano') + ")";
                document.getElementById('modalSinopse').innerText = card.getAttribute('data-sinopse');
                document.getElementById('modalDiretor').innerText = card.getAttribute('data-diretor');
                document.getElementById('modalAtores').innerText = card.getAttribute('data-atores');
                document.getElementById('modalGenero').innerText = card.getAttribute('data-genero');
                document.getElementById('modalRating').innerHTML = "⭐ " + card.getAttribute('data-rating') + " / 10 (IMDb)";

                document.getElementById('meuModal').style.display = 'flex';
            }
            function fecharModal() { document.getElementById('meuModal').style.display = 'none'; }
            function fecharModalExterno(e) { if(e.target.id === 'meuModal') fecharModal(); }
            function confirmarExclusao(e) {
                e.stopPropagation();
                return confirm('Tem certeza que deseja deletar permanentemente este título do MongoDB?');
            }
        </script>
    `);
});
// ==========================================
// FUNÇÃO ISOLADA DE TRADUÇÃO
// ==========================================
async function traduzir(texto) {
    if (!texto || texto === "N/A") return "Sinopse não disponível.";
    try {
        const resposta = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: texto,
                langpair: "en|pt-BR",
                de: "cineatlaspro@gmail.com"
            },
            timeout: 4000
        });
        if (resposta.data && resposta.data.responseData) {
            return resposta.data.responseData.translatedText;
        }
        return texto;
    } catch (e) {
        console.log("Falha na tradução:", e.message);
        return texto;
    }
}

// ==========================================
// 2. ROTA DE BUSCA POR APROXIMAÇÃO (?s=)
// ==========================================
app.get('/adicionar', async (req, res) => {
    const queryBusca = req.query.busca;
    let listaResultadosHtml = "";

    if (queryBusca) {
        const searchUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(queryBusca)}&apikey=${API_KEY}`;
        try {
            const response = await axios.get(searchUrl);
            const dadosBusca = response.data;

            if (dadosBusca.Response === "True" && dadosBusca.Search) {
                listaResultadosHtml = dadosBusca.Search.map(item => {
                    // Tratamento prévio da imagem para ficar em alta resolução também na pré-visualização
                    let posterAlta = item.Poster;
                    if(posterAlta && posterAlta !== 'N/A') {
                        posterAlta = posterAlta.replace(/_SX[0-9]+/, '_SX600');
                    }
                    return `
                    <div class="search-item">
                        <div style="display:flex; align-items:center;">
                            <img src="${posterAlta !== 'N/A' ? posterAlta : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500'}">
                            <div>
                                <strong style="font-size:16px;">${item.Title}</strong>
                                <p style="margin:4px 0 0 0; font-size:13px; color:#94a3b8;">${item.Year} | ${item.Type === 'series' ? 'Série' : 'Filme'}</p>
                            </div>
                        </div>
                        <form action="/salvar" method="POST" style="margin:0;">
                            <input type="hidden" name="imdbID" value="${item.imdbID}">
                            <button type="submit" class="btn" style="padding: 6px 12px; font-size:13px;">+ INJETAR NO BANCO</button>
                        </form>
                    </div>
                `}).join('');
            } else {
                listaResultadosHtml = `<p style="color:#ef4444; margin-top:20px;">Nenhum título parecido foi encontrado. Tente outro termo!</p>`;
            }
        } catch (err) {
            listaResultadosHtml = `<p style="color:#ef4444;">Erro de conexão com o servidor da API.</p>`;
        }
    }

    res.send(`
        ${CSS}
        <nav>
            <div><h2 style="margin:0; color:#fff;">Cine<span>Atlas</span> PRO</h2></div>
            <div><a href="/">Catálogo</a> <a href="/adicionar">Adicionar via API</a> <a href="/teoria">Tarefa S2</a></div>
        </nav>
        <div class="container">
            <div class="form-box">
                <h2>🔍 Busca Ampla por Aproximação</h2>
                <p style="color: #94a3b8; font-size: 14px;">Digite parte do nome de um filme ou série abaixo para listar os resultados próximos mundiais.</p>
                <form action="/adicionar" method="GET">
                    <input type="text" name="busca" placeholder="Ex: Star Wars, Marvel, Harry Potter, Matrix..." value="${queryBusca || ''}" required autofocus>
                    <button type="submit" class="btn">PROCURAR OPÇÕES</button>
                </form>
                
                <div class="search-results">${listaResultadosHtml}</div>
            </div>
        </div>
    `);
});

// ==========================================
// 3. ROTA SALVAR COM UPGRADE DE IMAGEM + TRADUTOR EFICIENTE (LINGVA API)
// ==========================================
app.post('/salvar', async (req, res) => {
    const imdbID = req.body.imdbID;
    const detailUrl = `http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`;
    
    try {
        const response = await axios.get(detailUrl);
        const f = response.data;

        // --- CHAMADA DA SUA FUNÇÃO ---
        const sinopseTraduzida = await traduzir(f.Plot);

        // 2. REGEX PARA UPGRADE DA IMAGEM PARA HD (Remove o corte de tamanho da OMDb)
        let urlPosterHD = f.Poster;
        if (urlPosterHD && urlPosterHD !== 'N/A') {
            urlPosterHD = urlPosterHD.replace(/_SX[0-9]+/, '_SX1000');
        }

        const novoDocumento = {
            titulo: f.Title,
            ano: parseInt(f.Year) || f.Year,
            tipo: f.Type === "series" ? "Série" : "Filme",
            genero: f.Genre,
            poster: urlPosterHD, // Salvando em altíssima qualidade
            sinopse: sinopseTraduzida,
            diretor: f.Director,
            atores: f.Actors,
            imdbRating: f.imdbRating,
            dataRegistro: new Date()
        };

        if (isCloudConnected) { 
            const db = client.db(dbName);
            await db.collection('midias').insertOne(novoDocumento);
            res.send(`<script>alert('"${novoDocumento.titulo}" importado com sucesso em ALTA RESOLUÇÃO e com sinopse em PT-BR!'); window.location.href='/';</script>`);
        } else {
            novoDocumento._id = String(Date.now());
            localBuffer.unshift(novoDocumento);
            res.send(`<script>alert('Salvo no buffer local temporário.'); window.location.href='/';</script>`);
        }

    } catch (error) {
        res.status(500).send("Erro ao salvar detalhes: " + error.message);
    }
});

// ==========================================
// 4. ROTA DE EXCLUSÃO
// ==========================================
app.post('/deletar/:id', async (req, res) => {
    const idItem = req.params.id;

    if (isCloudConnected) {
        try {
            const db = client.db(dbName);
            await db.collection('midias').deleteOne({ _id: new ObjectId(idItem) });
            res.send(`<script>alert('Filme removido permanentemente do MongoDB Local!'); window.location.href='/';</script>`);
        } catch (err) {
            res.status(500).send("Erro ao tentar deletar o item: " + err.message);
        }
    } else {
        localBuffer = localBuffer.filter(m => m._id !== idItem);
        res.send(`<script>alert('Removido do buffer de memória local.'); window.location.href='/';</script>`);
    }
});

// ==========================================
// 5. RELATÓRIO TEÓRICO
// ==========================================
app.get('/teoria', (req, res) => {
    res.send(`
        ${CSS}
        <nav>
            <div><h2 style="margin:0; color:#fff;">Cine<span>Atlas</span> PRO</h2></div>
            <div><a href="/">Catálogo</a> <a href="/adicionar">Adicionar via API</a> <a href="/teoria">Tarefa S2</a></div>
        </nav>
        <div class="container"><div class="docs">
            <h1>Relatório de Arquitetura Avançada (Tarefa S2)</h1>
            <p><strong>Desenvolvedor:</strong> Laety Maniery de Araújo Batista</p>
            <hr style="border:0; border-top:1px solid #334155; margin:20px 0;">
            <h3>Sanitização e Tratamento de Dados em Pipeline Backend</h3>
            <p>O sistema agora aplica transformações estruturais nas strings recebidas antes da persistência no banco NoSQL. O link de imagem original fornecido pela API de metadados passa por um tratamento via expressão regular (Regex) no Node.js para a substituição de tokens de compressão (<code>_SX300</code> para <code>_SX1000</code>), requisitando o asset em resolução nativa.</p>
            <p><strong>Pipeline de Tradução:</strong> Para mitigar problemas de CORS e chaves limitadas, a arquitetura foi desenhada para realizar uma requisição Server-to-Server assíncrona consumindo uma instância da Lingva API (de arquitetura descentralizada), traduzindo a chave de texto de sinopse em tempo de execução sem onerar o cliente (Browser).</p>
        </div></div>
    `);
});

app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SISTEMA PREMIUM DO CINEATLAS PRO ATIVADO`);
    console.log(`💻 Acesse o catálogo: http://localhost:${port}`);
    console.log(`==================================================\n`);
});