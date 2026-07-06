const express = require('express');
const midiaRoutes = require('./routes/midiaRoutes.js');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Injeta todo o módulo de rotas limpas na raiz do servidor
app.use('/', midiaRoutes);

app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 ARQUITETURA MODULAR`);
    console.log(`💻 Servidor escutando em: http://localhost:${port}`);
    console.log(`==================================================\n`);
});