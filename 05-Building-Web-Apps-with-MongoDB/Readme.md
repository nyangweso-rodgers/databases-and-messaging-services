# Building Web Applications with MongoDB

## Table Of Contents

# Setting Up Development Environment

## Step #1: Creating an Application

- Create a new project repository, e.g., `project/` and open the repository in an editor.
  ```sh
    mkdir project
    cd project
  ```
- Inside the project, run `npm init -y` command
  ```sh
    # initailize the repo
    npm init -y
  ```
- This will generate `package.json` file.

## Step #2: Install Required Dependencies

- We require `mongoose`, .........
  ```sh
      # Install required dependencies
      npm i mongoose --save
  ```

## Step #3: Setting Up Webserver

- Create a new file, `server.js` in the root folder.

- Remarks:

  - `server.js` acts as a **server-side** Node.js script that runs on your server. It's responsible for:

    - Connecting to your MongoDB database using the provided connection string and Mongoose.
    - Defining API routes to handle requests from your client-side JavaScript (such as adding new tasks).
    - Interacting with your `ToDo` model to perform CRUD operations (create, read, update, delete) on tasks in the database.
    - Sending JSON responses back to the client with relevant data or error messages.

  - This is different from `script.js` file which handles **client-side** JavaScript script that runs in the user's browser. It's responsible for:

    - Handling user interactions with the UI (e.g., adding new tasks through a form submission button).
    - Using Fetch API to send HTTP requests to your server-side API routes defined in `server.js`.
    - Receiving JSON responses from the server and updating the DOM (Document Object Model) of your `index.html` file to reflect the changes (e.g., adding new task elements to the list).

  - By separating these functionalities, you achieve a clean separation of concerns and security practices:
    - Sensitive database credentials are only exposed in `server.js`, which never runs in the user's browser.
    - The client-side code only interacts with your server through well-defined API routes, preventing direct data manipulation attempts.

- In the `server.js` file add the following code:
  ```js
  // server.js
  ```

## Step #4:Connecting Applications to MongoDB

- In the `server.js` file import `mongoose`:
  ```js
  // server.js
  // import Mongoose
  import Mongoose from "mongoose";
  ```
- Add the following code after:

  ```js
  // server.js
  import Mongoose from "mongoose";

  mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
  ```

# Resources
