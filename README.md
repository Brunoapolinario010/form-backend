# form-backend

Essa é apenas uma api feita para estudar zod.

## Como testar
Para clonar o repositório você vai precisar do [Git](https://git-scm.com/) e do [Node.js](https://nodejs.org/en) instalados no seu computador.

No seu terminal você deve digitar
```bash
# Clonar o repositório
git clone https://github.com/Brunoapolinario010/form-backend

# Acessar a pasta do repositório
cd form-backend

# Instalar as dependências
npm install

# Rodar o app
npm start
```

Antes de rodar o app deve ser criado um arquivo .env dentro da pasta form-backend contendo a url do banco de dados.
```dotenv

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=SCHEMA"

# Similar

DATABASE_URL="postgresql://harry:hogwars@localhost:5432/form-backend?schema=public"

```

Caso deseje visualizar o banco de dados você pode abrir outro terminal e utilizar `npx prisma studio`.

## Endpoints

Open endpoints require no Authentication.

* `GET /users/` -> Retorna todos os usuários.
* `GET /users/:id` -> Retorna o usuário com id repassado por parâmetro.
* `POST /users?limit=value&page=value` -> Cria um usuário -> Os valores padrões caso não sejam enviados o limite e a pagina serão respectivamente 20 e 1.
* `PUT /users/:id` -> Atualiza um campo do usuário
* `DEL /users/:id` -> Deleta o usuário com id repassado por parâmetro.

## JSON para criação de usuário
```json
{
	"username":	"harry",
	"password":	"12345678",
	"confirmPassword":	"12345678",
	"email":	"harry.potter@hogwarts.com",
	"gender":	"male",
	"terms":	true
}
```
## JSON para atualizar usuário
```json
{
  "username": "dobby",
  "email": "dobby@hogwarts.com"
}
```

### TODO

- [x] Integrar com um banco de dados
- [x] Trocar as senhas por hashs no armazenamento dos dados do usuário