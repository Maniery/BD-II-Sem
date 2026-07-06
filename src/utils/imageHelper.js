function otimizarPoster(urlPoster) {
    // 2. REGEX PARA UPGRADE DA IMAGEM PARA HD (Remove o corte de tamanho da OMDb)
    let urlPosterHD = urlPoster;
    
    if (urlPosterHD && urlPosterHD !== 'N/A') {
        urlPosterHD = urlPosterHD.replace(/_SX[0-9]+/, '_SX600');
    }

    // Se a API não devolver imagem, entrega uma imagem padrão de fundo
    if (!urlPosterHD || urlPosterHD === 'N/A') {
        return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500';
    }

    return urlPosterHD;
}

module.exports = { otimizarPoster };