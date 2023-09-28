# form-backend

Essa é apenas uma api feita para estudar zod.

## Como testar
Para clonar o repositório você vai precisar do [Git](https://git-scm.com/) e do [Node.js](https://nodejs.org/en) instalados no seu computador.

No seu terminal você deve digitar
```bash
# Clonar o repositório
$ git clone https://github.com/Brunoapolinario010/form-backend

# Acessar a pasta do repositório
$ cd form-backend

# Instalar as dependências
$ npm install

# Rodar o app
$ npm start
````

## Endpoints

Open endpoints require no Authentication.

* `GET /users/` -> Retorna todos os usuários
* `GET /users/:id` -> Retorna o usuário com id repassado por parâmetro
* `POST /users/` -> Cria um usuário
* `PUT /users/:id` -> Atualiza um campo do usuário
* `DEL /users/:id` -> Deleta o usuário com id repassado por parâmetro

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

- [ ] Integrar com um banco de dados
- [ ] Trocar as senhas por hashs no armazenamento dos dados do usuário