// Build a To Do App with MongoDB Atlas, JavaScript, HTML, CSS, and Bootstrap 5

// get document elements
const newTaskInput = document.getElementById("newTaskInput");
const addItemButton = document.getElementById("addItemButton");
const newTaskErrorElement = document.getElementById("newTaskErrorElement");
const displayTasksCol = document.getElementById("displayTasksCol");

//TODO: attach event listeners
addItemButton.addEventListener("click", (event) => {
  event.preventDefault(); // prevent default form submission behavior

  if (validateForm()) {
    // crete and display tasks logic goes here
    createAndDisplayTasks(newTaskInput.value);
    clearForm();
  }
});

//TODO:define function to display tasks logic
const createAndDisplayTasks = (taskText) => {
  const taskDivElement = document.createElement("div");
  taskDivElement.classList.add("border", "border-danger", "my-2");
  taskDivElement.textContent = taskText;
  displayTasksCol.appendChild(taskDivElement);
};

//TODO: define clearForm function
const clearForm = () => {
  newTaskInput.value = "";
};

//TODO: define an helper function for validating the form
const validateForm = () => {
  if (validateTaskInput(newTaskInput.value)) {
    return true; // for scuccessful form validation
  } else {
    console.log("Form submission failed due to validation errors!"); // You can also display an alert or message to the user here}
    return false;
  }
};

//TODO: define validateNewTaskInput function
const validateTaskInput = (taskInput) => {
  const taskInputText = String(taskInput); // convert to string
  if (taskInputText.trim() == "") {
    newTaskErrorElement.innerHTML = "Task input cannot be empty!";
    return false;
  } else if (taskInputText.length > 100) {
    newTaskErrorElement.innerHTML =
      "Task input must be less than 100 characters!";
    return false;
  }
  // clear any previous error messages
  newTaskErrorElement.innerHTML = "";
  return true;
};