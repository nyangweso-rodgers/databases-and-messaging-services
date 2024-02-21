# Building To Do App with MongoDB, JavaScript, HTML, CSS and Bootstrap 5

## Table Of Contents

# Description

-To create a to-do App, with HTML, CSS, JavaScript, and MongoDB, we need to set up both the frontend and backend components.

- In this project,we use Node.js and Fetch API for server-side and client-side communication.

# Typical Flow

- **Step #1**: User input

  - user enters a to do task in the HTML form
  - form submission triggers an `HTTP` request, `POST`, to the Node.js server

- **Step #2**: Server-side handling

  - Node.js server receives the request
  - It extracts the user input from the request body.
  - **Data persistence**
    - Server initiates a connection to MongoDB.
    - It creates a new document with the user input.
    - Asynchronously sends the document to MongoDB for insertion.
  - **UI Update** (after data persistence):
    - Server prepares a response containing the same user input data.
    - After successful persistence (using callbacks, `promises`, or `async`/`await`), it sends the response back to the browser.

- **Step #3**: UI Update
  - Browser receives the response from the server.
  - JavaScript code in the HTML page extracts the user input from the response.
  - It dynamically updates the relevant UI elements to display the input.

# Application Functionality

- A user should be able to add a new new task, see then listed on the UI, and save them to MongoDB Atlas.

- Project Structure:
  - `index.html`
    - This file will contain the structure of your HTML page, including the input field, button, and area where tasks will be displayed
  - `script.js`
    - This file will handle the client-side JavaScript code. It will capture user input, make a Fetch API call to your Node.js backend, and update the UI with the submitted task.
  - `server.js`
    - This file will contain the Node.js backend logic. It will handle incoming requests from the client, interact with MongoDB to store tasks, and send responses back to the client.
  - `.env`
    - This file will store environment variables, such as your MongoDB connection string.
  - index.css
  - node_modules/
  - package..json
  - package-lock.json
  - `model/toDoSchemaModel.js`
    - This file will define the schema for your ToDo tasks and create a model for interacting with MongoDB.

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
