# learning-app

> Work in progress

## Development

This diagram is an overview of the development environment.

![development](./images/development.drawio.svg)

TODO: fill out and clean up these dev instructions

- install docker, add link to docker website install process
- git clone repo and cd into directory
- show how to setup .env files
  - .env.local for frontend and firebase
  - .env for backend and postgresql
- start dev container (vscode instructions)
  - add screenshot of how to open command palette
  - add screenshot of command to open in dev container
- run

  ```bash
  export POSTGRES_PASSWORD="<PASSWORD FOR LOCAL DEV DB GOES HERE>"
  docker compose up --build
  ```

- open browser at <http://localhost:5173>
