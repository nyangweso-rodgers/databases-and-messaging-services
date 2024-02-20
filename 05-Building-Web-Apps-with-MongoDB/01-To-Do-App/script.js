// Build a To Do App with MongoDB Atlas, JavaScript, HTML, CSS, and Bootstrap 5

// get document elements
const newTaskInput = document.getElementById("newTaskInput");
const addItemButton = document.getElementById("addItemButton");
const newTaskErrorElement = document.getElementById("newTaskErrorElement");
const displayTasksCol = document.getElementById("displayTasksCol");

//TODO: attach event listeners
displayTasksCol.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validateForm()) {
    // crete and display tasks logic goes here
  }
});

//TODO:define function to display tasks logic
const createAndDisplayTasks = () => {};

//TODO: define clearForm function
const clearForm = () => {
  newTaskInput.value = "";
};

//TODO: define validateNewTaskInput function
const validateNewTaskInput = (newTaskInput) => {
  if (newTaskInput.trim() === "") {
    newTaskErrorElement.innerHTML = "New task input cannot be empty!";
    return false;
  } else if (newTaskInput.length > 100) {
    newTaskErrorElement.innerHTML =
      "New task input must be less than 100 characters!";
    return false;
  }
  // clear any previous error messages
  newTaskErrorElement.innerHTML = "";
  return true;
};

//TODO: define an helper function
const validateForm = () => {
  if (validateNewTaskInput(newTaskInput).value) {
    return true; // for scuccessful form validation
  } else {
    console.log("Form submission failed due to validation errors!"); // You can also display an alert or message to the user here}
    return false;
  }
};
