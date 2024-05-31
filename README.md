# Desafio Magalu Backend
# Sumário
- [Desafio Magalu Backend](#desafio-magalu-backend)
  - [Descrição](#descrição)
  - [Objetivo](#objetivo)
  - [Links](#links)
  - [Como Executar](#como-executar)
    - [Alternativa #1 - Node + Mongo](#alternativa-1---node--mongo)
      - [Requisitos](#requisitos)
      - [Passos](#passos)
    - [Alternativa #2 - Docker](#alternativa-2---docker)
      - [Requisitos](#requisitos-1)
      - [Passos](#passos-1)
  - [Testes](#testes)
    - [Cobertura de testes unitários](#cobertura-de-testes-unitários)
  - [Definições Técnicas](#definições-técnicas)
  - [Postman](#postman)
## Descrição
Esse projeto foi criado com o intuito de implementar a API proposta no <a href="https://github.com/misaku/Desafio-Full-Stack/blob/main/BACK-END.md" >repositório</a>.
## Objetivo
Faça um sistema que receba um arquivo via API REST e processe-o para ser retornado via API REST.

## Links
O projeto está hospedado na Northflank, e também foi contruído um site web que está sendo hospedado na Vercel.
- Back-end: https://p01--backend--7qb49cjkg5gj.code.run/api/v1/docs
- Front-end:  https://desafio-magalu-frontend.vercel.app/



## Como Executar
###  Alternativa #1 - Node + Mongo
### Requisitos
- Node (20.x ou superior)
- Mongo ou instância mongo

### Passos
Clonar este repositório:
```
   git clone https://github.com/FelipeJhordan/desafio-magalu-backend.git
```
Ir para o diretório:
```
  cd desafio-magalu-backend
```

Criar arquivo .env:
```
PORT=5050
APPLICATION_TITLE="OS STATION"
APPLICATION_VERSION="v1"
ALLOW_REPEAT_FILE_FLAG=1
MAX_CHUNK_SIZE=2048
# DATABASE ENVS
DATABASE_URI={MONGO_URL}
```

Criar container e executar:
```
docker compose build
docker compose up
```

###  Alternativa #2 - Docker
### Requisitos
- Docker

### Passos
Clonar este repositório:
```
   git clone https://github.com/FelipeJhordan/desafio-magalu-backend.git
```
Ir para o diretório:
```
  cd desafio-magalu-backend
```
Criar arquivo .env
```
PORT=5050
APPLICATION_TITLE="OS STATION"
APPLICATION_VERSION="v1"
ALLOW_REPEAT_FILE_FLAG=1
MAX_CHUNK_SIZE=2048
# DATABASE ENVS
DATABASE_URI={MONGO_URL}
```
Instalar as dependências:
```
npm install // yarn
```
Executar a aplicação:
```
npm run start:dev
```

## Testes
- [X] Testes unitários
- [ ] Testes de integração
### Cobertura de testes unitários
![coverage](https://github.com/FelipeJhordan/desafio-magalu-backend/assets/44248690/f0b6a892-4db2-43a5-a925-098530c97b32)

## Definições Técnicas

## Postman
Foi criado uma collection postman com exemplo de algumas chamadas.
Link: https://github.com/FelipeJhordan/desafio-magalu-backend/blob/main/doc/Magalu.postman_collection.json

