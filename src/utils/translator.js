const axios = require('axios');

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
        console.log("Falha na tradução (usando texto original):", e.message);
        return texto;
    }
}

module.exports = { traduzir };