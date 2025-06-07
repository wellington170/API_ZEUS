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
- [Cloudinary](https://cloudinary.com/)
- [streamifier](https://www.npmjs.com/package/streamifier)
- [Swagger](https://swagger.io/)
- [NestJS](https://nestjs.com/)


## 🎲 Escolha do Banco de Dados
- Escolhi o MySQL por ser um banco relacional que garante integridade e consistência dos dados, facilitando o gerenciamento dos relacionamentos entre membros e orçamentos. Além disso, tem boa performance e integração eficiente com o Sequelize.

## 📁 Estrutura do Projeto
```
src/
├── apps/                     # Camada de aplicação
│   ├── controllers/          # Lógica das rotas (request/response)
│   ├── middlewares/          # Middlewares para autenticação e validação de schema
│   └── models/               # Modelos de dados de membros, clientes e orçamentos
├── configs/                  # Configurações do projeto como db.js, emailConfig.js e multer.js
├── database/                 # Conexão com banco de dados e migrations
├── schema/                   # Validações JSON
├── utils/                    # Funções utilitárias
├── swagger.yaml              # Documentação da API no padrão Swagger
├── swaggerConfig.js          # Configuração do Swagger UI para a documentação
├── routes.js                 # Definição e organização das rotas principais
├── server.js                 # Ponto de entrada do servidor
```

## 🎮 Explicação dos Controllers
- Autenticação.js
    - Responsável pelos serviços de login, sendo suas funções:
        - authenticate -> faz o login com email e senha
        - firstAuthenticate -> faz o primeiro login com email, senha, e confirma_senha
        - reset -> reseta a senha, pedindo o código, email, senha e confirma_senha
        - codigo -> envia o código de confirmação pelo email
- ControleCliente.js
    - CRUD completo dos clientes(somente administradores)
- ControleDeMembros.js 
    - CRUD completo dos membros(somente administradores)
- ControleDosMembros.js
    - Somente acessado por um membro logado e tem as seguintes funções:
        - updateMembro -> altera informações do próprio perfil
        - listar -> lista os orçamentos que o membro é responsável
        - updateOrcamento -> altera informações dos próprios orçamentos
- ControleOrcamentos.js
    - CRUD completo dos orçamentos(somente administradores)

## 🔑 Explicação dos utils
- createAdm.js
    - Cria o administrador inicial com email: adm@compjunior.com.br e senha: admin123
- crypt.js
    - Encripta e desencripta dados, no caso, a função é usada para criptografar o ID do usuário
- envioEmail.js
    - Usa o nodemail para enviar um email padrão de recuperação de senha
- resetPassword.js
    - Gerencia códigos de redefinição de senha
- token.js
    - Valida e decodifica um token JWT recebido no header Authorization
- verificaAdm.js 
    - Verifica se o usuário logado é um administrador
- verificaBloqueio.js
    - Verifica se o tempo de bloqueio do usuário já expirou
- verificaCpfCnpj.js
    - Verifica se o formato do CPF/CNPJ está de acordo com XXX.XXX.XXX.XX ou XX.XXX.XXX/XXXX-XX
        - fonte: https://irias.com.br/blog/como-validar-cpf-cnpj-em-node-js/
- verificaTelefone.js
    - Verifica se o telefone é válido e o formato do número, aceitando (xx)xxxxx-xxxx ou xxxxxxxxxxx
        - fonte: https://gist.github.com/jonathangoncalves/7bdec924e9bd2bdf353d6b7520820b62
- verificaCEP.js
    - verifica se o CEP existe e preenche os dados: rua, bairro, cidade e estado
        - fonte: https://viacep.com.br/exemplo/javascript/

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
        - CRUD completo de clientes
    - Usuários
        - Listar orçamentos que está responsável
        - Atualizar informações do seu perfil
        - Atualizar informações de seus orçamentos

## 🛣 Principais Rotas
- As rotas também estão disponíveis através da documentação do swagger em http://localhost:3001/api-docs
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

    - POST /adm/clientes/create
    Cria um cliente.
    - DELETE /adm/clientes/delete/:id
    Deleta um cliente pelo ID.
    - PUT /adm/clientes/update/:id
    Atualiza um cliente
    - GET /adm/clientes/listar
    Lista todos os clientes

## 🛠️ Pré-requisitos
- MySQL instalado e rodando(caso rode com docker, pare o MYSQL antes de rodar as imagens)
- Node.js intalado com versão 16 ou superior
- NPM (Gerenciador de pacotes do node.js)
- GIT Para clonar o repositório
- Docker (opcional, caso prefira rodar a aplicação em containers)

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
PORT=3001
DIALECT=mysql
HOST=db
DB_USERNAME=root
PASSWORD=root
DATABASE=base_zeus
DB_PORT=3306
HASH_BCRYPT=dcee57ceb0b251443b2b1c74f9f641870417903d50e20292fa8a02b9f2160e5c
SECRET_CRYPTO=07e37e42ac5a22f9b107e43c4f8bf2f4
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER= SEU EMAIL
EMAIL_PASS=SEU EMAIL PASS
CLOUDINARY_CLOUD_NAME=NAME DO SEU CLOUDINARY
CLOUDINARY_API_KEY=KEY DO SEU CLOUDINARY
CLOUDINARY_API_SECRET=SECRET DO SEU CLOUDINARY
```
5. **Rodar com o Docker**
```bash
docker-compose up --build
```
5. O projeto será executado em http://localhost:3001
6. Teste as rotas no Postman, os endpoints estão disponíveis dentro da pasta collections, na raíz do projeto
7. Caso um erro como:
```
api_zeus    | /usr/bin/env: use -[v]S to pass options in shebang lines                                    
api_zeus    | /usr/bin/env: 'bash\r': No such file or directory                                           
api_zeus    | /usr/bin/env: use -[v]S to pass options in shebang lines                                    
api_zeus    | /usr/bin/env: 'bash\r': No such file or directory                                           
api_zeus    | /usr/bin/env: use -[v]S to pass options in shebang lines
api_zeus    | /usr/bin/env: 'bash\r': No such file or directory                                           
api_zeus exited with code 127          
```
apareça, vá até o arquivo wait-for-it.sh e altere no canto inferior direito o Select End Of Line Sequence do VSCODE, e troque CRLF por LF.
Este erro ocorre porque as quebras de linha em CRLF estão no formato windows, contudo, o docker executa o arquivo no ambiente linux, logo
esse mudança se faz necessária
## ⚠️ Dificuldades
- Entendimento inicial da linguagem JavaScript e suas principais funções

