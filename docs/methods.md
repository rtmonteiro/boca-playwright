# Métodos

## Contest

### Criar um Contest

Será necessário um login de nível system e as informações base de um contest (Nome, Data e horário de início, Data e horário de término da turma, Número da turma principal, e o id da sala principal)

```json
{
    "setup": {
        "url": "localhost:8000/boca"
    },
    "logins": {
        "system": {
            "username": "system",
            "password": "boca"
        }
    },
    "contests": [
        {
            "setup": {
                "name": "Contest 1",
                "startDate": "2023-10-10 10:00",
                "endDate": "2023-10-18 10:00",
                "mainSiteNumber": 1,
                "active": true
            }
        }
    ]
}
```

### Atualizar um Contest

Será necessário um login de nível system e as informações base de um contest já criado (Id, Nome, Data e horário de início, Data e horário de término da turma, Número da turma principal, e o id da sala principal)

```json
{
    "setup": {
        "url": "localhost:8000/boca"
    },
    "logins": {
        "system": {
            "username": "system",
            "password": "boca"
        }
    },
    "contests": [
        {
            "setup": {
                "id": 1,
                "name": "Contest 1",
                "startDate": "2023-10-10 10:00",
                "endDate": "2023-10-18 10:00",
                "mainSiteNumber": 1,
                "active": true
            }
        }
    ]
}
```

### Limpar um Contest

Será necessário um login de nível system e o id de um contest já criado

```json
{
    "setup": {
        "url": "localhost:8000/boca"
    },
    "logins": {
        "system": {
            "username": "system",
            "password": "boca"
        }
    },
    "contests": [
        {
            "setup": {
                "id": 1
            }
        }
    ]
}
```

## Usuários

### Adicionar um Usuário

Será necessário um login de nível admin e as informações base de um usuário (Identificador do Site em que o Usuário se encontra, Número identificador do Usuário, Tipo de Usuário, Nome do Usuário, Descrição do Usuário e Senha do Usuário). Nesse caso, como a propriedade `users` é um array, é possível adicionar mais de um usuário de uma vez.

```json
{
  "setup": {
    "url": "localhost:8000/boca"
  },
  "logins": {
    "admin": {
      "username": "admin",
      "password": "boca"
    }
  },
  "users": [
    {
      "userSiteNumber": 1,
      "userNumber": "2023101500",
      "userName": "brucewayne",
      "userType": "Team",
      "userFullName": "BRUCE WAYNE",
      "userDesc": "Major: 11 / Registration: 2023101500 / E-mail: bruce.wayne@edu.ufes.br",
      "userPassword": "boca",
      "userChangePass": "Yes"
    },
    {
      "userSiteNumber": 1,
      "userNumber": "1",
      "userName": "ryanmonteiro",
      "userType": "Team",
      "userFullName": "Ryan Tavares Farias da Silva Monteiro",
      "userDesc": "ryan.monteiro@aluno.ufes.br",
      "userPassword": "boca",
      "userChangePass": "Yes"
    }
  ]
}
```

### Inserir Usuários através de um arquivo txt

Será necessário um login de nível admin e um arquivo txt padronizado com as informações base de usuários (Identificador do Site em que o Usuário se encontra, Número identificador do Usuário, Tipo de Usuário, Nome do Usuário, Descrição do Usuário e Senha do Usuário)

```json
{
  "setup": {
    "url": "localhost:8000/boca"
  },
  "logins": {
    "admin": {
      "username": "admin",
      "password": "boca"
    }
  },
  "users": [
    {
      "userSiteNumber": 1,
      "userNumber": "2019202359",
      "userName": "ryanmonteiro",
      "userType": "Team",
      "userFullName": "Ryan Tavares Farias da Silva Monteiro",
      "userDesc": "