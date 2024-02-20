# User Management

## Table of Contents

# Setup Development Environment

- step 1: install [Node.js](https://nodejs.org/en)
- step 2: create `02-Order-Management` directory and switch to the folder:

  ```sh
      # create directory
      mkdir 01-User-Management
      cd   02-User-Management
  ```

- step 3:

  - run the following command in the terminal
    ```sh
        # initialize Node.js project
        npm init -y
    ```
  - this initializes a new `Node.js` project with a `package.json` file with default configuration settings

- step 4:

  - install `mongoose` and `nodemon`
    ```sh
        npm i mongoose
        npm i -D nodemon
        npm i dotenv
    ```

- Remarks:
  - `npm i -D nodemon` is used to install `nodemon` package as a development dependency in a `Node.js` project.
  - the `D` flag is short for `--save-dev`. It tells `npm` to add the package as a development dependency in the `package.json` file.
  - **Development dependencies** are typically packages that are only needed during development and testing, not in the production environment.
  - `nodemon` is a utility that monitors for changes in your `Node.js` application and automatically restarts the server when changes are detected. It is commonly used during development to streamline the development workflow.
- step 5:
  - add the below script to `package.json` for running our project.
  - We will also use ES Modules instead of Common JS, so we’ll add the module type as well. This will also allow us to use top-level await.
    ```json
        // package.json
         "scripts": {
            "dev": "nodemon index.js"
         },
         type: "module",
    ```

## Create a `user` Schema and Model

- create a new folder/file structure `model/userSchemaModel.js`

## Create a `user-management` database with a `users` Collection

# Resources
