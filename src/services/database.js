const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
const dbName = 'streaming_db';

let isCloudConnected = false;

// Buffer de contingência se o banco cair
// No seu database.js, adicione a classificação aos objetos de teste:
let localBuffer = [
    { 
        _id: "1", 
        titulo: "Interestelar", 
        ano: 2014, 
        tipo: "Filme", 
        genero: "Sci-Fi", 
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500", 
        sinopse: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.", 
        diretor: "Christopher Nolan", 
        atores: "Matthew McConaughey, Anne Hathaway", 
        imdbRating: "8.7",
        classificacao: "PG-13" 
    },
    { 
        _id: "2", 
        titulo: "A Origem", 
        ano: 2010, 
        tipo: "Filme", 
        genero: "Action, Sci-Fi", 
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500", 
        sinopse: "Um ladrão que rouba segredos corporativos por meio do uso de tecnologia de compartilhamento de sonhos.", 
        diretor: "Christopher Nolan", 
        atores: "Leonardo DiCaprio, Joseph Gordon-Levitt", 
        imdbRating: "8.8",
        classificacao: "PG-13" 
    }
];
async function initDB() {
    try {
        await client.connect();
        module.exports.isCloudConnected = true;
        console.log("🚀 [BANCO LOCAL] Conexão ativa com o MongoDB!");
    } catch (e) {
        module.exports.isCloudConnected = false;
        console.log("⚠️ [ALERTA] Modo de Contingência Ativado (Memória Local).");
    }
}

initDB();

module.exports = {
    client,
    dbName,
    getIsCloudConnected: () => module.exports.isCloudConnected,
    getLocalBuffer: () => localBuffer,
    setLocalBuffer: (newBuffer) => { localBuffer = newBuffer; }
};