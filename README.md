# ⚡ API-ZEUS
- Projeto back-end desenvolvido em javascript que relaciona protocolos http com o banco de dados, o qual
é formado duas tabelas, uma de membros e outra de orçamentos, os quais podem ser consultados, excluídos,
criados e atualizados por um administrador.

## 🔎 Tecnologias utilizadas
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Postman](https://www.postman.com/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js/)
- [nodemailer](https://nodemailer.com/)
- [Multer](https://github.com/expressjs/multer)

## 🎲 Escolha do Banco de Dados
- Escolhi o MySQL por ser um banco relacional que garante integridade e consistência dos dados, facilitando o gerenciamento dos relacionamentos entre membros e orçamentos. Além disso, tem boa performance e integração eficiente com o Sequelize.

## 📁 Estrutura do Projeto
```
src/
├── apps/                     # Camada de aplicação
│   ├── controllers/          # Lógica das rotas (request/response)
│   ├── middlewares/          # Middlewares para autenticação e validação
│   └── models/               # Modelos de dados de membros e orçamentos
├── configs/                  # Configurações do projeto como db.js, emailConfig.js e multer.js
├── database/                 # Conexão com banco de dados e migrations
├── schema/                   # Validações JSON
├── utils/                    # Funções utilitárias
├── routes.js                 # Definição e organização das rotas principais
├── server.js                 # Ponto de entrada do servidor
```

## ⚙️ Funcionalidades
- Relação com um banco de dados relacional
    - Autenticação
        - Login
        - Primeiro Login
        - Envio de código para recuperação de senha
        - Recuperação de senha
    - Administrador
        - CRUD completo de membros
        - CRUD completo de orçamentos de projeto
    - Usuários
        - Listar orçamentos que está responsável
        - Atualizar informações do seu perfil
        - Atualizar informações de seus orçamentos

## 🛣 Principais Rotas

### Autenticação
    -  POST /login  
    Realiza o login do usuário com validação dos dados.

    - POST /primeiro_login  
    Autenticação inicial para usuários no primeiro acesso.

    - POST /login/recuperacao_de_senha/codigo  
    Envia ou valida código para recuperação de senha.

    - PUT /login/recuperacao_de_senha/reset  
    Redefine a senha após validação do código.


### Rotas Protegidas (exigem autenticação)

#### Usuário

    - PUT /user/perfil 
    Atualiza o perfil do usuário.

    - GET /user/listarOrcamentos  
    Lista os orçamentos do usuário.

    - PUT /user/updateOrcamento/:id  
    Atualiza um orçamento específico do usuário.

#### Administração (ADM)

    - POST /adm/create  
    Cria um novo membro com foto.

    - GET /adm/listar  
    Lista todos os membros.

    - DELETE /adm/delete/:id  
    Remove um membro pelo ID.

    - PUT /adm/atualizar/:id  
    Atualiza dados de um membro.

    - POST /adm/orcamento/create  
    Cria um novo orçamento.

    - DELETE /adm/orcamento/delete/:id  
    Remove um orçamento pelo ID.

    - PUT /adm/orcamento/update/:id  
    Atualiza um orçamento existente.

    - GET /adm/orcamento/listar  
    Lista todos os orçamentos.

## 🚀 Como Executar o Projeto
1. **Clone o repositório**  
```bash
   git clone https://github.com/wellington170/API_ZEUS.git
   cd API_ZEUS
```
2. **Instale as dependências**
    ```bash
    npm install
    ```
3. **Crie um .env com os seguintes valores na raíz do projeto**
```
=3001
DIALECT=mysql
HOST=localhost
DB_USERNAME=root
PASSWORD=root
DATABASE=base_zeus
DB_PORT=3306
HASH_BCRYPT=dcee57ceb0b251443b2b1c74f9f641870417903d50e20292fa8a02b9f2160e5c
SECRET_CRYPTO=07e37e42ac5a22f9b107e43c4f8bf2f4
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=wellingtoncostagrilo2018@gmail.com
EMAIL_PASS=axyy bpah yyyo ybbo
```
5. **Rodar com o Docker**
```bash
docker-compose up --build
```
5. O projeto será executado em http://localhost:3001
6. Teste as rotas no Postman

## ⚠️ Dificuldades
- Entendimento de algumas tecnologias como nodemailer, multer e bcryptjs

