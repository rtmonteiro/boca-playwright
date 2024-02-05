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
