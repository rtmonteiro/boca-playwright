# boca-playwright

## Como rodar o projeto

### Localmente

- Instalar o [Node.js](https://nodejs.org/en/download/)
- Executar o comando `npm install` na pasta do projeto
- Executar o comando `npm start -- <caminho do arquivo de configuração> <comando>` na pasta do projeto

### Docker

- Instalar o [Docker](https://docs.docker.com/get-docker/)
- Criar um arquivo de configuração seguindo o modelo do arquivo `resources/setup.json`
- Executar o comando `docker build -t boca-playwright .` na pasta do projeto
- Executar o comando `docker run -it --rm boca-playwright <caminho do arquivo de configuração> <comando>` na pasta do projeto

## Lista de comandos

- shouldCreateUser
- shouldInsertUsers
- shouldDeleteUser
- shouldCreateContest
- shouldClearContest
- shouldCreateSite
- shouldCreateProblem
- shouldGenerateReport

### Exemplos

- Cria usuário a partir dos valores dentro do arquivo JSON na propriedade `users`
    ```bash
    npm start -- resources/setup.json shouldCreateUser
    ```

- Cria usuário a partir do arquivo localizado na url da propriedade `setup.userPath`
    ```bash
    npm start -- resources/setup.json shouldInsertUsers
    ```
  
- Deleta um usuário a partir do primeiro valor dentro do arquivo JSON na propriedade `users`
    ```bash
    npm start -- resources/setup.json shouldDeleteUser
    ```

- Cria um contest a partir do primeiro valor dentro do arquivo JSON na propriedade `contests`
    ```bash
    npm start -- resources/setup.json shouldCreateContest
    ```

- Atualiza um contest a partir do primeiro valor dentro do arquivo JSON na propriedade `contests`
    ```bash
    npm start -- resources/setup.json shouldUpdateContest
    ```
  
- Limpa valores de um contest a partir do primeiro valor dentro do arquivo JSON na propriedade `contests`
    ```bash
    npm start -- resources/setup.json shouldClearContest
    ```

- Cria um site a partir do primeiro valor dentro do arquivo JSON na propriedade `sites`
    ```bash
    npm start -- resources/setup.json shouldCreateSite
    ```

- Cria um problema a partir do primeiro valor dentro do arquivo JSON na propriedade `problems`
    ```bash
    npm start -- resources/setup.json shouldCreateProblem
    ```

- Gera um relatório de runs do site e deposita os arquivos na pasta definida na propriedade `outDir`
    ```bash
    npm start -- resources/setup.json shouldGenerateReport
    ```
