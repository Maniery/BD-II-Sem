# CineAtlas PRO 🎬

O **CineAtlas PRO** é um ecossistema inteligente para catálogos de streaming desenvolvido em Node.js. Ele consome dados em tempo real da OMDb API, realiza a tradução automatizada de sinopses e faz o mapeamento dinâmico da classificação indicativa para o padrão brasileiro (ClassInd), aplicando estilização visual baseada no nível de restrição.

O grande diferencial do projeto é o seu **Modo de Contingência Híbrido**: caso o banco de dados MongoDB fique inacessível ou desconectado, o sistema ativa automaticamente um buffer em memória (Sandbox) para manter a aplicação 100% funcional.

---

## 🛠️ Requisitos Mínimos

Antes de inicializar o projeto, certifique-se de ter instalado em sua máquina:

1. **Node.js** (Versão 18 ou superior) -> [Baixar Node.js](https://nodejs.org/)
2. **MongoDB Community Server** (Recomendado para persistência) -> [Baixar MongoDB](https://www.mongodb.com/try/download/community)
3. **MongoDB Compass** (Interface visual para gerenciamento de dados) -> [Baixar Compass](https://www.mongodb.com/try/download/compass)

---

## 🚀 Instruções de Instalação e Compilação (Passos 1 ao 5)

Siga a sequência abaixo executando os comandos no seu terminal para colocar o projeto para rodar do zero:

```bash
# PASSO 1: Abra a pasta do projeto no seu editor de código (ex: VS Code) ou navegue até ela via terminal:
cd "caminho/para/a/pasta/BDII SEM"

# PASSO 2: Instale todas as dependências e bibliotecas do ecossistema (express, axios, mongodb):
npm install

# PASSO 3: Certifique-se de que o serviço do seu MongoDB local está ativo em segundo plano.
# O sistema se conectará automaticamente na URI nativa: mongodb://127.0.0.1:27017
# Nota: Se o banco estiver desligado, o sistema ativará o Modo Sandbox em memória automaticamente!

# PASSO 4: Inicialize o servidor back-end do projeto:
node src/server.js

# PASSO 5: Abra o seu navegador web e acesse o endereço local para testar o catálogo:
# http://localhost:3000