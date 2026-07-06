const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ObjectId } = require('mongodb');

const dbService = require('../services/database');
const { traduzir } = require('../utils/translator');
const { otimizarPoster } = require('../utils/imageHelper');
const { converterClassificacao } = require('../utils/ratingHelper');

// IMPORTA AS VISÕES MODULARIZADAS
const { renderCatalogo, renderBusca, renderTeoria } = require('../views/midiaView');

const API_KEY = "3808cb61";

// 1. HOME: CATÁLOGO
router.get('/', async (req, res) => {
    let mídias = [];
    let statusHTML = `<span class="status-badge offline">💻 Modo Sandbox (Memória)</span>`;
    
    const { tipo, ano } = req.query;
    let queryFiltro = {};
    if (tipo) queryFiltro.tipo = tipo;
    if (ano) queryFiltro.ano = parseInt(ano);

    if (dbService.getIsCloudConnected()) {
        try {
            const db = dbService.client.db(dbService.dbName);
            mídias = await db.collection('midias').find(queryFiltro).sort({ _id: -1 }).toArray();
            statusHTML = `<span class="status-badge online">🟢 Conectado ao MongoDB Local</span>`;
        } catch (err) { mídias = dbService.getLocalBuffer(); }
    } else {
        mídias = dbService.getLocalBuffer().filter(m => {
            if (tipo && m.tipo !== tipo) return false;
            if (ano && m.ano !== parseInt(ano)) return false;
            return true;
        });
    }

    // Apenas entrega os dados para a nossa View renderizar!
    res.send(renderCatalogo(mídias, statusHTML, tipo, ano));
});

// 2. TELA DE BUSCA (API)
router.get('/adicionar', async (req, res) => {
    const queryBusca = req.query.busca;
    let listaResultadosHtml = "";

    if (queryBusca) {
        try {
            const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(queryBusca)}&apikey=${API_KEY}`);
            if (response.data.Response === "True") {
                listaResultadosHtml = response.data.Search.map(item => `
                    <div class="search-item">
                        <div style="display:flex; align-items:center;">
                            <img src="${otimizarPoster(item.Poster)}">
                            <div><strong>${item.Title}</strong><p style="margin:4px 0 0 0; font-size:13px; color:#94a3b8;">${item.Year}</p></div>
                        </div>
                        <form action="/salvar" method="POST" style="margin:0;"><input type="hidden" name="imdbID" value="${item.imdbID}"><button type="submit" class="btn">+ INJETAR NO BANCO</button></form>
                    </div>
                `).join('');
            } else { listaResultadosHtml = `<p style="color:#ef4444;">Nenhum título encontrado.</p>`; }
        } catch (err) { listaResultadosHtml = `<p style="color:#ef4444;">Erro de conexão com a API.</p>`; }
    }

    res.send(renderBusca(listaResultadosHtml, queryBusca));
});

// 3. PERSISTÊNCIA (SALVAR NO MONGO)
router.post('/salvar', async (req, res) => {
    const { imdbID } = req.body;
    try {
        const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
        const f = response.data;

        const sinopseTraduzida = await traduzir(f.Plot);
        const posterHD = otimizarPoster(f.Poster);

        const novoDocumento = {
            titulo: f.Title,
            ano: parseInt(f.Year) || f.Year,
            tipo: f.Type === "series" ? "Série" : "Filme",
            genero: f.Genre,
            poster: posterHD,
            sinopse: sinopseTraduzida,
            classificacao: converterClassificacao(f.Rated),
            diretor: f.Director,
            atores: f.Actors,
            imdbRating: f.imdbRating,
            dataRegistro: new Date()
        };

        if (dbService.getIsCloudConnected()) {
            const db = dbService.client.db(dbService.dbName);
            await db.collection('midias').insertOne(novoDocumento);
        } else {
            novoDocumento._id = String(Date.now());
            dbService.getLocalBuffer().unshift(novoDocumento);
        }
        res.send(`<script>alert('Salvo com sucesso!'); window.location.href='/';</script>`);
    } catch (error) { res.status(500).send("Erro ao salvar: " + error.message); }
});

// 4. EXCLUSÃO (DELETAR DO MONGO)
router.post('/deletar/:id', async (req, res) => {
    const { id } = req.params;
    if (dbService.getIsCloudConnected()) {
        try {
            const db = dbService.client.db(dbService.dbName);
            await db.collection('midias').deleteOne({ _id: new ObjectId(id) });
        } catch (err) { return res.status(500).send("Erro ao deletar."); }
    } else {
        dbService.setLocalBuffer(dbService.getLocalBuffer().filter(m => m._id !== id));
    }
    res.send(`<script>alert('Removido!'); window.location.href='/';</script>`);
});

// 5. ABA TEÓRICA SEMINÁRIO
router.get('/teoria', (req, res) => {
    res.send(renderTeoria());
});

module.exports = router;