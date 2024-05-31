# Detalhes Técnicos
## Tecnologias Utilizadas
- Nestjs
- Mongo
- Docker ( opcional )
- Terminus ( Healthcheck )
- Swagger
  
## Features
### Funcionais
- [x] Verificação de hash de arquivo para evitar duplicações
- [x] Busca de pedidos com filtros
- [x] Cálculo do total de cada pedido
- [x] Processamento de arquivo e modelagem de dados para salvar já normalizado
### Não funcionais
- [x] Swagger com modelo de dados e descrições
- [x] CI/CD para execução de testes unitários
- [x] Modelo de Feature Toggle para desabilitar verificação de hash.
- [x] Endpoint de healthcheck para verificar status do mongo

## Patterns
### Proxy
O padrão Proxy foi utilizado para adicionar uma camada de indireção ao instanciar os casos de uso. Isso é útil por que é uma boa maneira de não anotar os casos de usos com nenhum tipo de decorator ou ferramenta, injetando de forma manual as depêndencias externas, que são providas no usescases-proxy module, e utilizados para instanciar os casos de usos.

### Adapter
O padrão adapter foi utilizado para criar uma interface para ser utilizada no contrato do GenerateFileUsecase, de forma onde o caso de uso não fique presa a implementação de uma ferramenta específica.

## Processamento de Arquivo
### Validação de hash
- Foi adicionado um toggle para verificação ou não de hash de arquivo, considerando que pode-se prejudial um usuário processar várias vezes o mesmo arquivo, sendo proposital ou não.
- Caso a feature seja habilidade, irá resultar uma resposta de ERRO 400.
### Uso de Chunks
- Para evitar processamento concorrente de muitas linhas, foi utilizado a estratégia de separar em partes menores o processamento de linhas que foi enviado pelo usuário.
### Salvamento
- Por não conter um campo de "quantidade", é lógico de que se trata de um processo onde um mesmo "user_id", "order_id" e "product_id" pode se repetir, de forma onde resulta em uma quantidade 2 do mesmo produto no pedido.
- portando sempre é adicionado o produto no pedido, caso esses valores se repitam.
- É feito um processamento para atualizar ou criar os documentos em formato semelhante ao que é buscado na feature de buscar pedidos, de forma que melhora a velocidade de retorno de dados.
### Retorno de entradas inválidas
- Foi utilizado uma estratégia onde linhas "inadequadas" são ignoradas do processo, onde elas são mostradas no retorno da API.

## Busca de pedidos
- A busca de pedidos foi facilitada devido a normalização dos dados no processamento de arquivo, o que gera a necessidade de uma pequena pipeline somente para filtrar e somar o total de cada pedido.

## Escolha das tecnologias
### Nestjs
Foi utilizado Nestjs por ser uma ferramenta que permite o rápido desenvolvimento e com organização já pré-definida para envio de dados e IOC.
Também foi escolhida por ser um framework que o desenvolvedor mais teve contato, tendo assim mais capacidade de extrair o máximo de seus recursos.

### Mongo
MongoDB foi utilizado, pois permite a fácil criação de agregações e e filtros para utilização e montagem de dados desnormalizados.
Foi utilizado a estratégia de agregar as linhas em comuns em objetos pré formatados e salvar no banco de dados como documento, de forma que a busca no mongo seja mais rápida e inteligente.
Essa abordagem o contra de ter processamento extra no salvamento, porém isso trás ganhos, pois evita de ter que processar toda vez que é feito uma busca diferente.

## Organização de pastas
A aplicação foi organizada de forma onde cada pasta seria referente a um modulo específico, com excessão da pasta de application que se responsabiliza por algumas interfaces, constants e processos inerentes ao nestjs e também ao diretório core, que contêm os módulos de módulos principais da aplicação.
Cada Módulo foi separado tentando seguir uma nomenclatura inspirada no Clean Arch:
- Presentation para camada de apresentação para o usuário / cliente
- Domain para entidades puras, casos de usos e interfaces que devem ser implementadas
- Infra que são implementações de interfaces que os casos de uso utilizam e também entidades não puras que contêm a utilização de bibliotecas e frameworks.

## Design
![Diagrama sem nome drawio (2)](https://github.com/FelipeJhordan/desafio-magalu-backend/assets/44248690/213c5a5b-20b1-4666-969a-0121c918ca61)
