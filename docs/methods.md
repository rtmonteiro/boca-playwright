# Métodos

## Contest

### Criar um Contest

Será necessário somente um login de nível system, pois o sistema BOCA já gera um contest com as informações padrão, ao criar um novo. Mas caso o usuário queira, pode passar as informações de um contest listadas abaixo, na propriedade `contest`.

| Parâmetro          | Tipo                  | Descrição                                                     |
| ------------------ | --------------------- | ------------------------------------------------------------- |
| name               | string                | Nome do Contest                                               |
| startDate          | string ( yyyy-MM-dd ) | Data e horário de início do Contest                           |
| endDate            | string ( yyyy-MM-dd ) | Data e horário de término do Contest                          |
| stopAnsweringDate  | string ( yyyy-MM-dd ) | Data e horário do término da correção dos problemas           |
| stopScoreboardDate | string ( yyyy-MM-dd ) | Data e horário de término da atualização da tabela do ranking |
| penalty            | string (number)       | Penalidade de tempo para cada submissão incorreta             |
| maxFileSize        | string (number)       | Tamanho máximo do arquivo                                     |
| mainSiteUrl        | string (url)          | URL do site principal                                         |
| mainSiteId     | string                | Número do site principal                                      |
| localSiteId    | string                | Número do site local                                          |

Exemplo de criação de um contest sem informações adicionais:

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "system",
    "password": "boca"
  }
}
```

Exemplo de criação de um contest com informações adicionais:

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
    "name": "Contest 1",
    "startDate": "2023-10-20 10:00",
    "endDate": "2023-10-30 22:00",
    "stopAnsweringDate": "2023-10-30 22:00",
    "stopScoreboardDate": "2023-10-30 22:00",
    "penalty": "20",
  }
}
```

### Atualizar um Contest

Será necessário um login de nível system, o id do contest e pelo menos um dos parâmetros listados na tabela de parâmetros do Contest.

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
    "id": 2,
    "startDate": "2023-10-20 10:00",
    "endDate": "2023-10-30 22:00",
  }
}
```

## Usuários

### Adicionar um Usuário

Será necessário um login de nível admin e as informações base de um usuário listadas na tabela abaixo.

| Parâmetro      | Tipo                                   | Descrição                       |
| -------------- | -------------------------------------- | ------------------------------- |
| siteId | string                                 | Identificador do Site           |
| id     | string                                 | Número identificador do Usuário |
| username       | string                                 | Nome do Usuário                 |
| type       | Team, Judge, Admin, Staff, Score, Site | Tipo de Usuário                 |
| fullName   | string                                 | Nome completo do Usuário        |
| description       | string                                 | Descrição do Usuário            |
| password   | string                                 | Senha do Usuário                |
| allowPasswordChange | Yes, No                                | Necessidade de troca de senha   |

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
    "siteId": 1,
    "id": "2019202359",
    "username": "ryanmonteiro",
    "type": "Team",
    "fullName": "Ryan Tavares Farias da Silva Monteiro",
    "description": "ryan.monteiro@aluno.ufes.br",
    "password": "boca",
    "allowPasswordChange": "Yes"
  }
}
```

### Inserir Usuários através de um arquivo txt

Será necessário um login de nível admin e um arquivo txt padronizado com as informações base de usuários

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

Será necessário um login de nível admin e o nome do usuário a ser deletado.

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
    "username": "brucewayne"
  }
}
```

## Problemas

### Adicionar um Problema

Será necessário um login de nível admin e as informações base de um problema listadas na tabela abaixo.

| Parâmetro  | Tipo    | Descrição                       |
| ---------- | ------- | ------------------------------- |
| id         | number  | Identificador do Problema       |
| name       | string  | Nome do Problema                |
| filePath   | string  | Caminho do arquivo do Problema  |
| colorName  | string? | Nome da cor do Problema         |
| colorCode  | string? | Código da cor do Problema       |

```json
{
  "config": {
    "url": "localhost:8000/boca"
  },
  "login": {
    "username": "admin",
    "password": "boca"
  },
  "problem": {
    "id": 1,
    "name": "A - Hello World",
    "filePath": "/resources/A.zip",
    "colorName": "basic",
    "colorCode": "FF0000"
  }
}
```
