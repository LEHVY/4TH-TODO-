const inputBox = document.getElementById("input-box");
const ul = document.getElementById("list");

inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("click").click();
    }
});

// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", loadFromStorage);

// Add new list item
function createlist() {
    const value = inputBox.value.trim();

    if (value === "") {
        alert("Please add a text");
    } else {
        addListItem(value, "Pending");
        inputBox.value = "";
        saveToStorage();
    }
}

// Add item to UI
function addListItem(text, status) {
    let todolist = document.createElement("li");
    todolist.textContent = text;


// Edit Icon
let editIcon = document.createElement("BUTTON");
editIcon.className = "editicon";
editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
</svg>`;
editIcon.addEventListener("click", function () {
    const currentText = todolist.childNodes[0].nodeValue.trim();

    // Create input field
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;

    // Replace text node with input 
    todolist.insertBefore(input, todolist.firstChild);
    todolist.removeChild(todolist.childNodes[1]); // Remove original text node

    // Save edited text on blur or Enter
    input.addEventListener("blur", saveEdit);
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            saveEdit();
        }
    });

    function saveEdit() {
        const newText = input.value.trim();
        if (newText === "") {
            alert("Text cannot be empty.");
            input.focus();
            return;
        }

        const newTextNode = document.createTextNode(newText);
        todolist.insertBefore(newTextNode, input);
        todolist.removeChild(input);
        saveToStorage();
    }

    input.focus();
});
todolist.appendChild(editIcon);



    // Status button
    let statusBtn = document.createElement("BUTTON");
    statusBtn.className = "currentStatus";
    statusBtn.textContent = status;
    statusBtn.style.color = status === "Completed" ? "red" : "black";
    todolist.appendChild(statusBtn);

    // Toggle status
    statusBtn.addEventListener("click", function () {
        if (statusBtn.textContent === "Pending") {
            statusBtn.textContent = "Completed";
            statusBtn.style.color = "red";
        } else {
            statusBtn.textContent = "Pending";
            statusBtn.style.color = "black";
        }
        saveToStorage();
    });

    // Delete button
    let deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e74c3c">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>`;
    deleteBtn.addEventListener("click", function () {
        ul.removeChild(todolist);
        saveToStorage();
    });

    todolist.appendChild(deleteBtn);
    ul.appendChild(todolist);
}

// Save all items to localStorage
function saveToStorage() {
    const items = [];
    ul.querySelectorAll("li").forEach(li => {
        const text = li.childNodes[0].nodeValue.trim();
        const status = li.querySelector(".currentStatus").textContent;
        items.push({ text, status });
    });
    localStorage.setItem("todoList", JSON.stringify(items));
}

// Load items from localStorage
function loadFromStorage() {
    const stored = localStorage.getItem("todoList");
    if (stored) {
        const items = JSON.parse(stored);
        items.forEach(item => addListItem(item.text, item.status));
    }
}

//updating a stored list element with edit icon