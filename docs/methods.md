# Métodos

## Contest

### Criar um Contest

Será necessário um login de nível system e as informações base de um contest (Nome, Data e horário de início, Data e
horário de término da turma, Número da turma principal, e o id da sala principal)

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "system",
    "password": "boca"
  },
  "contest": {
    "setup": {
      "name": "Contest 2",
      "startDate": "2023-10-20 10:00",
      "endDate": "2023-10-30 22:00",
      "mainSiteNumber": 1,
      "active": true
    }
  }
}
```

### Atualizar um Contest

Será necessário um login de nível system e as informações base de um contest já criado (Id, Nome, Data e horário de
início, Data e horário de término da turma, Número da turma principal, e o id da sala principal)

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "system",
    "password": "boca"
  },
  "contest": {
    "setup": {
      "id": 2,
      "name": "Contest 2",
      "startDate": "2023-10-20 10:00",
      "endDate": "2023-10-30 22:00",
      "mainSiteNumber": 1,
      "active": true
    }
  }
}
```

## Usuários

### Adicionar um Usuário

Será necessário um login de nível admin e as informações base de um usuário (Identificador do Site em que o Usuário se
encontra, Número identificador do Usuário, Tipo de Usuário, Nome do Usuário, Descrição do Usuário e Senha do Usuário).

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "admin",
    "password": "boca"
  },
  "user": {
    "userSiteNumber": 1,
    "userNumber": "2019202359",
    "userName": "ryanmonteiro",
    "userType": "Team",
    "userFullName": "Ryan Tavares Farias da Silva Monteiro",
    "userDesc": "ryan.monteiro@aluno.ufes.br",
    "userPassword": "boca",
    "userChangePass": "Yes"
  }
}
```

### Inserir Usuários através de um arquivo txt

Será necessário um login de nível admin e um arquivo txt padronizado com as informações base de usuários (Identificador
do Site em que o Usuário se encontra, Número identificador do Usuário, Tipo de Usuário, Nome do Usuário, Descrição do
Usuário e Senha do Usuário)

```json
{
  "config": {
    "url": "localhost:8000/boca",
    "userPath": "/resources/BOCA_USERS.txt"
  },
  "login": {
    "username": "admin",
    "password": "boca"
  }
}
```

### Deletar um Usuário

Será necessário um login de nível admin e o número identificador do usuário

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "admin",
    "password": "boca"
  },
  "user": {
    "userName": "brucewayne"
  }
}
```
