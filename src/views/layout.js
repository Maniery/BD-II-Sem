const CSS = `
<style>
    :root { --mongo-green: #00ED64; --mongo-dark: #001E2B; --bg: #020617; --card: #1e293b; --text: #f8fafc; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; }
    nav { background: var(--mongo-dark); padding: 1rem 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--mongo-green); position: sticky; top: 0; z-index: 100; }
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
    .tag { background: rgba(0, 237, 100, 0.1); color: var(--mongo-green); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; align-self: flex-start; }
    .btn-delete { position: absolute; top: 15px; left: 15px; background: rgba(239, 68, 68, 0.9); border: none; color: white; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: 0.2s; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .btn-delete:hover { background: #ef4444; transform: scale(1.1); }
    .form-box { background: var(--card); padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid var(--mongo-green); text-align: center; }
    .form-box input { width: 100%; padding: 12px; margin: 15px 0; background: var(--bg); border: 1px solid #334155; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
    .search-results { display: flex; flex-direction: column; gap: 15px; margin-top: 30px; text-align: left; }
    .search-item { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1); }
    .search-item img { height: 70px; width: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
    .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
    .modal-content { background-color: var(--card); border: 2px solid var(--mongo-green); border-radius: 16px; width: 100%; max-width: 850px; max-height: 90vh; display: grid; grid-template-columns: 320px 1fr; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .modal-close { position: absolute; top: 15px; right: 20px; color: #fff; font-size: 30px; font-weight: bold; cursor: pointer; z-index: 10; background: rgba(0,0,0,0.5); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
    .modal-left { height: 100%; background: #0f172a; }
    .modal-left img { width: 100%; height: 100%; object-fit: cover; }
    .modal-right { padding: 40px 30px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; max-height: 90vh; box-sizing: border-box; }
    .modal-rating { color: #f59e0b; font-weight: bold; display: flex; align-items: center; gap: 5px; }
    #modalSinopse { color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 10px 0; }
</style>
`;

function renderLayout(conteudoHtml) {
    return `
        ${CSS}
        <nav>
            <div><h2 style="margin:0; color:#fff;">Cine<span>Atlas</span> PRO</h2></div>
            <div><a href="/">Catálogo</a> <a href="/adicionar">Adicionar via API</a> <a href="/teoria">Tarefa S2</a></div>
        </nav>
        
        ${conteudoHtml}
        
        <div id="meuModal" class="modal" onclick="fecharModalExterno(event)">
            <div class="modal-content">
                <span class="modal-close" onclick="fecharModal()">&times;</span>
                <div class="modal-left"><img id="modalPoster" src=""></div>
                <div class="modal-right">
                    <span id="modalTipo" class="tag"></span>
                    <h2 id="modalTitulo"></h2>
                    <div id="modalRating" class="modal-rating"></div>
                    <p id="modalSinopse"></p>
                    <p style="font-size:14px; margin: 2px 0;">🔞 <strong>Classificação:</strong> <span id="modalClassificacao" style="font-weight:bold;"></span></p>
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
                document.getElementById('modalRating').innerHTML = "⭐ " + card.getAttribute('data-rating') + " / 10"; 
                
                const faixaEtaria = card.getAttribute('data-classificacao');
                const elClassificacao = document.getElementById('modalClassificacao');
                elClassificacao.innerText = faixaEtaria;
                if (faixaEtaria.includes('Livre') || faixaEtaria.includes('10')) elClassificacao.style.color = '#00ED64';
                else if (faixaEtaria.includes('12') || faixaEtaria.includes('14')) elClassificacao.style.color = '#f59e0b';
                else elClassificacao.style.color = '#ef4444';
                
                document.getElementById('meuModal').style.display = 'flex'; 
            }
            function fecharModal() { document.getElementById('meuModal').style.display = 'none'; }
            function fecharModalExterno(e) { if(e.target.id === 'meuModal') fecharModal(); }
            function confirmarExclusao(e) { e.stopPropagation(); return confirm('Deletar do MongoDB?'); }
        </script>
    `;
}

module.exports = { renderLayout };