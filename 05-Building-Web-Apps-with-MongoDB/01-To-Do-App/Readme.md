# Building To Do App with MongoDB, JavaScript, HTML, CSS and Bootstrap 5

## Table Of Contents

# Description

-To create a to-do App, with HTML, CSS, JavaScript, and MongoDB, we need to set up both the frontend and backend components.

- In this project,we use Node.js and Fetch API for server-side and client-side communication.

# Application Functionality

- A user should be able to add a new new task, see then listed on the UI, and save them to MongoDB Atlas.

- Project Structure:
  - index.html
  - index.js
  - index.css
  - node_modules/
  - package..json
  - package-lock.json
  - model/toDoSchemaModel.js

## Step #1: Frontend (HTML, CSS, JavaScript)

### HTML Structure

- Modify your HTML to include placeholders for displaying tasks and capture new task input.
  ```html
  <section class="">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 border">
          <div class="input-group">
            <input
              id=""
              class="form-control"
              type="text"
              placeholder="New Task"
            />
            <button class="btn btn-lg btn-success" type="button">
              Add Item
            </button>
          </div>
        </div>
      </div>
      <div id="display-tasks-row" class="row">
        <div id="display-tasks-col" class="col-sm-12"></div>
      </div>
    </div>
  </section>
  ```

### CSS

- Add some styles:
  ```css
  body {
    font-family: "Trirong", serif;
  }
  main {
    border: 2px dotted #ff004d;
    padding: 40px 0;
  }
  ```

### JavaScript

- Add an event listener to the "Add Item" `button` to capture the task input and send it to the server.
- Update the UI to display tasks.

# Step #2: Backend (Server-side) Setup (Node.js)

## Step 2.1: Setup Node.js project.

- Initialize the project folder by running `npm init -y`
- Install required dependancies:

  ```sh
    # install required dependencies
    npm i mongoose
    npm install dotenv
    npm install nodemon # optional
  ```

- Since we are using ES6, set `"type": "module"` in the `package.json` file:
  ```json
    "type": "module",
  ```

## Step 2.2: Create a `.env` File

- Create a `.env` file in the project root directory.
- Add MongoDB Atlas connection string.

  ```env
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster_url>/<database_name>?retryWrites=true&w=majority
  ```

## Step 2.3: Create a `server.js`

- Inside the project, create a `server.js` file and setup a `.env` configuration.
  ```js
  // server.js
  require("dotenv").config();
  ```
- Connect to MongoDB Atlas

  ```js
  // server.js - Connect to MongoDB Atlas
  const mongoose = require("mongoose");
  const uri = process.env.MONGO_URI;

  mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
  ```

- Run `node server.js` to test the connection.
- Remark:

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

- Define the `ToDo` model by creating a `model/` folder with a `toDoSchemaModeljsjs` file that defines the schema. Then in the `server.js` file, import the `toDoSchemaModeljs` model
  ```js
  // server.js
  const ToDo = require("./model/toDoSchemaModel");
  ```
- Create an API route to handle adding new tasks
  ```js
  // server.js
  server.post("/api/tasks", async (req, res) => {
    const newTask = new ToDo(req.body);
    try {
      await newTask.save();
      res.json({ message: "Task added successfully!" });
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ message: "Error adding task" });
    }
  });
  ```

## Step #2.4: Start the Server

- In the terminal, run `node server.js`

# Next Step

## Deploy Application to Vercel

1. [Live Preview]()
2. [GitHub Repository]()

# Resources

1. [getbootstrap.com - Input Group](https://getbootstrap.com/docs/5.0/forms/input-group/)
