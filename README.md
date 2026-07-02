# 🎬 CineAtlas PRO - Catálogo de Streaming NoSQL

Este repositório contém o material completo desenvolvido para o seminário da disciplina de **Banco de Dados II**. O projeto consiste em uma plataforma web dinâmica integrada em tempo real ao banco de dados NoSQL em nuvem **MongoDB Atlas**.

---

## 👥 Equipe
* **Integrante:** Laety Maniery de Araújo Batista

---

## 🗄️ SGBD Escolhido: MongoDB
O **MongoDB** é um banco de dados NoSQL líder de mercado, classificado como um SGBD **orientado a documentos**. 

### Por que usar o MongoDB para Catálogos de Streaming?
* **Esquema Flexível (Schemaless):** Ao contrário dos bancos relacionais (SQL), os documentos no MongoDB (armazenados em formato BSON) não exigem uma estrutura rígida. Uma mídia do tipo "Série" pode conter o atributo `temporadas` ou `episodios`, enquanto um "Filme" pode omitir esse campo sem a necessidade de migrações complexas de tabelas.
* **Alta Performance e Escalabilidade:** Ideal para lidar com grandes volumes de leituras e escritas simultâneas, características comuns em plataformas de streaming reais como Netflix e Prime Video.

---

## 💡 Conceitos Iniciais e Comandos Básicos
A aplicação demonstra de forma prática os pilares do CRUD do SGBD utilizando o driver oficial do Node.js:

1. **`insertOne()` (CREATE):** Utilizado na rota `/salvar` da aplicação para capturar os dados enviados pelo formulário web e persistir o novo documento no cluster do MongoDB Atlas.
2. **`find()` (READ):** Utilizado na rota principal (`/`) para buscar e listar todos os títulos registrados na nuvem, aplicando ordenação decrescente pelo identificador único (`_id`).

---

## 🛠️ Instalação e Configuração do Ambiente

O ecossistema do projeto foi projetado para ser resiliente e de fácil orquestração.
### 0. Git clone https://github.com/Maniery/BD-II-Sem
* Clonando o repositório
### 1. Pré-requisitos
* Node.js instalado localmente.
* Docker / Docker Desktop (para replicação do ambiente de banco isolado).

### 2. Infraestrutura Local (Docker)
O repositório inclui o arquivo `docker-compose.yml` pré-configurado para subir uma instância local do banco na porta padrão:
```bash
docker compose up -d
