function converterClassificacao(ratingAmericana) {
    if (!ratingAmericana || ratingAmericana === 'N/A') return 'Livre';

    // Remove espaços e transforma em maiúsculo para evitar erros de leitura
    const rating = ratingAmericana.trim().toUpperCase();

    // Mapeamento oficial aproximado da MPA (EUA) para ClassInd (Brasil)
    switch (rating) {
        case 'G':
        case 'TV-G':
        case 'APPROVED':
        case 'PASSED':
            return 'Livre (L)';
            
        case 'PG':
        case 'TV-PG':
            return '10 anos';
            
        case 'PG-13':
        case 'TV-14':
            return '12 anos';
            
        case 'R':
        case 'NC-17':
        case 'TV-MA':
            return '16 anos';
            
        case 'X':
            return '18 anos';
            
        default:
            // Caso venha uma idade em número direto da API (Ex: "14", "13")
            if (rating.includes('14')) return '14 anos';
            if (rating.includes('16')) return '16 anos';
            if (rating.includes('18')) return '18 anos';
            if (rating.includes('12')) return '12 anos';
            if (rating.includes('10')) return '10 anos';
            
            return 'Livre (L)'; // Padrão seguro caso não identifique
    }
}

module.exports = { converterClassificacao };