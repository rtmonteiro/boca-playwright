# :balloon: boca-playwright

[![Build and publish multi-platform_Docker images on ghcr.io workflow][build_publish_workflow_badge]][build_publish_workflow_link]
[![Delete GitHub Actions cache for repository workflow][cache_cleanup_workflow_badge]][cache_cleanup_workflow_link]
[![Delete_untagged_and/or_unsupported_Docker_images_on_ghcr.io_workflow][packages_cleanup_workflow_badge]][packages_cleanup_workflow_link]
[![Close_stale_issues_and_PRs_workflow][close_stale_workflow_badge]][close_stale_workflow_link]

[![Node HYDROGEN][node_hydrogen_badge]][node_hydrogen_link]
[![Node IRON][node_iron_badge]][node_iron_link]
[![Multi-Architecture][arch_badge]][arch_link]

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/rtmonteiro/boca-playwright)
[![Google_Groups][groups_badge]][groups_link]

[build_publish_workflow_badge]: https://img.shields.io/github/actions/workflow/status/rtmonteiro/boca-playwright/ci.yml?label=build%20images&logo=github
[build_publish_workflow_link]: https://github.com/rtmonteiro/boca-playwright/actions?workflow=CI "build and publish multi-platform images"
[cache_cleanup_workflow_badge]: https://img.shields.io/github/actions/workflow/status/rtmonteiro/boca-playwright/clean-cache.yml?label=clean%20cache&logo=github
[cache_cleanup_workflow_link]: https://github.com/rtmonteiro/boca-playwright/actions?workflow=delete%20GitHub "delete github actions cache"
[packages_cleanup_workflow_badge]: https://img.shields.io/github/actions/workflow/status/rtmonteiro/boca-playwright/clean-packages.yml?label=clean%20packages&logo=github
[packages_cleanup_workflow_link]: https://github.com/rtmonteiro/boca-playwright/actions?workflow=delete%20untagged "delete untagged/unsupported images"
[close_stale_workflow_badge]: https://img.shields.io/github/actions/workflow/status/rtmonteiro/boca-playwright/close-stale.yml?label=close%20stale&logo=github
[close_stale_workflow_link]: https://github.com/rtmonteiro/boca-playwright/actions?workflow=close%20stale "close stale issues and prs"
[node_hydrogen_badge]: https://img.shields.io/badge/Node.js-v20-43853D.svg?logo=Node.js&logoColor=white
[node_iron_badge]: https://img.shields.io/badge/Node.js-v18-43853D.svg?logo=Node.js&logoColor=white
[node_hydrogen_link]: https://hub.docker.com/_/node/tags?page=1&name=hydrogen "node:hydrogen image"
[node_iron_link]: https://hub.docker.com/_/node/tags?page=1&name=iron "node:iron image"
[arch_badge]: https://img.shields.io/badge/multi--arch-%20amd64%20|%20arm/v7%20|%20arm64/v8%20|%20ppc64le%20|%20s390x%20-lightgray.svg?logo=Docker&logoColor=white
[arch_link]: #how-to-run-on-different-node-release-images "multi-arch images"
[groups_badge]: https://img.shields.io/badge/join-boca--users%20group-blue.svg?logo=data:image/png;base64,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
[groups_link]: https://groups.google.com/g/boca-users "boca-users@Google Groups"

## Table of Contents

- [:balloon: boca-playwright](#balloon-boca-playwright)
  - [Table of Contents](#table-of-contents)
  - [What Is BOCA?](#what-is-boca)
  - [Why boca-playwright?](#why-boca-playwright)
  - [Requirements](#requirements)
  - [Quick Start](#quick-start)
    - [Localmente](#localmente)
    - [Docker](#docker)
  - [Lista de comandos](#lista-de-comandos)
    - [Exemplos](#exemplos)
  - [How To Run On Different Node Release Images](#how-to-run-on-different-node-release-images)
  - [How To Build It (For Development)](#how-to-build-it-for-development)
  - [How To Publish It](#how-to-publish-it)
  - [How To Contribute](#how-to-contribute)
  - [License](#license)
  - [Support](#support)

## What Is BOCA?

TODO

## Why boca-playwright?

TODO

## Requirements

- Install and configure [Docker](https://www.docker.com/get-started) for your operating system.

## Quick Start

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

- createUser
- insertUsers
- deleteUser
- createContest
- updateContest
- createSite
- createProblem
- generateReport

### Exemplos

```sh
docker run -it \
           --rm \
           -v "$PWD"/resources/mocks:/tmp/resources \
           boca-playwright /tmp/resources/create_contest.json createContest

```

- Cria usuário a partir dos valores dentro do arquivo JSON na propriedade `user`

    ```bash
    npm start -- -p resources/setup.json -m createUser
    ```

- Cria usuário a partir do arquivo localizado na url da propriedade `setup.userPath`

    ```bash
    npm start -- -p resources/setup.json -m insertUsers
    ```

- Deleta um usuário a partir do primeiro valor dentro do arquivo JSON na propriedade `user`

    ```bash
    npm start -- -p resources/setup.json -m deleteUser
    ```

- Cria um contest a partir do primeiro valor dentro do arquivo JSON na propriedade `contests`

    ```bash
    npm start -- -p resources/setup.json -m createContest
    ```

- Atualiza um contest a partir do primeiro valor dentro do arquivo JSON na propriedade `contests`

    ```bash
    npm start -- -p resources/setup.json -m updateContest
    ```

- Cria um site a partir do primeiro valor dentro do arquivo JSON na propriedade `sites`

    ```bash
    npm start -- -p resources/setup.json -m createSite
    ```

- Cria um problema a partir do primeiro valor dentro do arquivo JSON na propriedade `problems`

    ```bash
    npm start -- -p resources/setup.json -m createProblem
    ```

- Gera um relatório de runs do site e deposita os arquivos na pasta definida na propriedade `outReportDir`

    ```bash
    npm start -- -p resources/setup.json -m generateReport
    ```

## How To Run On Different Node Release Images

TODO

## How To Build It (For Development)

- Clone this repository and set it as your working directory:

  ```sh
  git clone https://github.com/rtmonteiro/boca-playwright.git
  cd boca-playwright
  ```

- Then, use the commands below to build the image:

  ```sh
  # List images
  docker image ls

  # Build image
  docker build --build-arg NODE_ENV=development -f Dockerfile -t boca-playwright .
  ```

## How To Publish It

> **NOTE:** These instructions take into account the Docker image generated in the previous section (no multi-platform support).

- After building, set the user and image tags accordingly. The IMAGE_ID's will show up with the `docker image ls`;

  ```sh
  docker tag IMAGE_ID ghcr.io/rtmonteiro/boca-playwright:1.0.0
  ```

- Log in into GitHub's Container Registry using your username and personal access token (details [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry));

  ```sh
  docker login ghcr.io
  ```

- Push the container image to registry.

  ```sh
  docker push ghcr.io/rtmonteiro/boca-playwright:1.0.0
  ```

## How To Contribute

If you would like to help contribute to this project, please see [CONTRIBUTING](https://github.com/rtmonteiro/boca-playwright/blob/main/CONTRIBUTING.md).

This repository makes use of the Visual Studio Code Dev Containers extension to develop inside a Docker container and take advantage of Visual Studio Code's full feature set. A **development container** is a running container with a well-defined tool/runtime stack and its prerequisites.

To get started, follow these steps:

- Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension;

- Clone this repository and open it in VS Code:

  ```sh
  git clone https://github.com/rtmonteiro/boca-playwright.git
  cd boca-playwright
  code .
  ```

- Try it out with the [**Dev Containers: Reopen in Container**](https://code.visualstudio.com/assets/docs/devcontainers/create-dev-container/dev-containers-reopen.png) command;

- When VS Code restarts, you'll be within a container. You can open a terminal window and test the program:

  ```sh
  npm start -- -p tests/new_contest.json -m createContest
  ```

- Close the window to stop the container;

- Before submitting a PR consider building and testing a Docker image locally (see [here](#how-to-build-it-for-development));

- And checking your code with Super-Linter:

  ```sh
  docker run --rm \
             -e ACTIONS_RUNNER_DEBUG=true \
             -e RUN_LOCAL=true \
             -e DEFAULT_BRANCH=main \
             --env-file ".github/super-linter.env" \
             -v "$PWD":/tmp/lint \
             ghcr.io/super-linter/super-linter:latest
  ```

## License

Copyright Universidade Federal do Espirito Santo (Ufes)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

This program is released under license GNU GPL v3+ license.

## Support

Please report any issues with _boca-playwright_ at [https://github.com/rtmonteiro/boca-playwright/issues](https://github.com/rtmonteiro/boca-playwright/issues)
