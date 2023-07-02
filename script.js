// Memory array to store the submitted memories
let memories = [];
let editIndex = null;

// DOM elements
const mainContainer = document.getElementById("mainContainer");
const passwordContainer = document.getElementById("passwordContainer");
const writeButton = document.getElementById("writeButton");
const readButton = document.getElementById("readButton");
const memoryForm = document.getElementById("memoryForm");
const passwordForm = document.getElementById("passwordForm");
const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const memoryInput = document.getElementById("memory");
const memoryDisplay = document.getElementById("memoryDisplay");

// Open a connection to the IndexedDB database
var request = window.indexedDB.open("memoryDB", 1);

request.onupgradeneeded = function (event) {
  var db = event.target.result;

  // Create an object store to store the memories
  db.createObjectStore("memories", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function (event) {
  var db = event.target.result;

  // Load memories from IndexedDB on page load
  loadMemoriesFromDB();

  // Handle password submission
  passwordForm.addEventListener("submit", handlePasswordSubmit);

  // Handle form submission
  memoryForm.addEventListener("submit", handleFormSubmit);

  // Set the initial mode
  setMode("read");
};

request.onerror = function () {
  console.error("Error opening database.");
};

// Function to handle password submission
function handlePasswordSubmit(event) {
  event.preventDefault();
  const password = document.getElementById("password").value;

  // Check if the entered password is correct
  if (password === "july3") {
    passwordContainer.style.display = "none";
    mainContainer.style.display = "block";
    setMode("read");
    alert("Pt.1\n\nYou're prolly curious as to what this is I know. Well umm this is kinda my attempt at getting you a meaningful anniversary present bro.\n So what is this? Well I remember you telling me you were sad as to how you were forgetting stuff you wanted to remember hameesha k liye and you know mere pov main u dont forget shit u just lose that thread that connected you to it. You don't forget what the memory was, you just forget k that memory exists hence you never recall it again. So I made this for you. It's a virtual memory jar. I thought you'd like to write everything you wanted to remember yahan pae and then it'll be preserved forever and you'll never lose that memory poori trah. You can always come back yahan and read it. You can really use this to preserve anything you want honestly cuz sab kuch hi memory bann jata aik time pae. So this is kinda a virtual diary that I made for you. Noone knows it exists and july3 is the password. I'm never gonna open ye again cuz its urs ab sae. So umm in short, I knew you were sad about your memory being shitty and uk trust me itll be fine soon but I just made this website for you in the hopes that you'll find it useful and will use it. The website is kinda pretty basic cuz I made it bht quickly 2-3 days main. If you want any changes theme main or colors main or anything just lemme know I'll find a way to add em in no problemo. Hope you like this *fingers crossed harddd*\n");
    alert("Pt.2\n\nTwo years mayn oof. I never thought you'd be able to bardaasht me itna with the shit I've done to you. Thank you for being my person, Arziesh. I'm the luckiest man in the world to have such a beautiful human's love tbh. It's been a good two years and a bad two years I know. I've wronged you in many ways, I've walked all over you, I've demanded too much and given you less than nothing. You know I regret that but what faida does being sorry or regretting shit ever have. I've promised myself to make the next whole year about amends and I know I've given you nothing to trust me but believe I'm trying fr this time and Imma make you happy. I would just like you to know, I love you the most in this world arzu. I care about you more than anybody ever cared about anyone. I hope I can be someone you feel safe with and at home with kisi din. I hope you'll call me your person someday cuz trust me I ain't going anywhere and imma achieve all those titles dekhein. Ye note ab zyada lamba horha hai and ik ur dyslexic so ill conclude. I hope you like this smol sa attempt at a meaningful anniversary gift janji, I tried making the website mobile compatible too, it'll zoom in a bit whenever ur typing shit u can zoom out jab bhi u want to. Write k option sae write ka dialog box khul jata and read sae all your entries will be displayed you can scroll thru them easily. So like you can use it on ur mobile and laptop too. I added date ka option to help u classify and also cuz u remember shit thru dates. I really hope you like it! And I really hope you use it. You can use it instead of ur notes wali app too if u wanna rant here or just keep it for the memories ur choice.");
    alert("Pt.3 \n\nI mean its completely urs, nobody knows it exists, imma delete sab files off my pc so I won't be able to get in ever. So iss like ur safe space to do as u please.\nThe password for u is july3 hamari anniversary date ull remember it tht way. Umm if you use it on your laptop, you'll only be able to see ur entries laptop pae, like you'll have to use the same browser on the same device hameesha. So i'd recommend k when u write pehly baar open the link on a device ur not gonna change anytime soon(ur gonna change phone soon), ill fine a permanent fix tho dw\n Chal I'll send you iska link 12 bajay hope ur net is on tabb. I love you so much man. Happy Anniversary and may we both see better years ahead aik doosre k sath.");
  } else {
    alert("Incorrect password. Please try again.");
  }
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const date = dateInput.value;
  const memory = memoryInput.value;

  // Create memory object
  const newMemory = {
    name: name,
    date: date,
    memory: memory,
  };

  if (editIndex !== null) {
    // Edit existing memory
    newMemory.id = memories[editIndex].id;
    updateMemoryInDB(newMemory);
  } else {
    // Add new memory
    addMemoryToDB(newMemory);
  }

  // Clear the form
  nameInput.value = "";
  dateInput.value = "";
  memoryInput.value = "";
}

// Function to delete a memory
function deleteMemory(id) {
  deleteMemoryFromDB(id);
}

// Function to edit a memory
function editMemory(id) {
  const memory = memories.find((m) => m.id === id);
  nameInput.value = memory.name;
  dateInput.value = memory.date;
  memoryInput.value = memory.memory;
  editIndex = id;
  setMode("write");
}

// Function to update the memory display
function updateMemoryDisplay() {
  memoryDisplay.innerHTML = "";

  if (memories.length === 0) {
    memoryDisplay.innerHTML = "<p>No memories found.</p>";
    return;
  }

  for (let i = 0; i < memories.length; i++) {
    const memory = memories[i];

    const memoryElement = document.createElement("div");
    memoryElement.classList.add("memory");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => deleteMemory(memory.id));

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => editMemory(memory.id));

    const nameElement = document.createElement("h3");
    nameElement.innerText = memory.name;

    const dateElement = document.createElement("p");
    dateElement.innerText = memory.date;

    const memoryTextElement = document.createElement("p");
    memoryTextElement.innerText = memory.memory;

    memoryElement.appendChild(deleteButton);
    memoryElement.appendChild(editButton);
    memoryElement.appendChild(nameElement);
    memoryElement.appendChild(dateElement);
    memoryElement.appendChild(memoryTextElement);

    memoryDisplay.appendChild(memoryElement);
  }
}

// Function to set the mode (write/read)
function setMode(mode) {
  if (mode === "write") {
    writeButton.classList.add("active");
    readButton.classList.remove("active");
    memoryForm.style.display = "block";
    updateMemoryDisplay();
    editIndex = null;
  } else if (mode === "read") {
    readButton.classList.add("active");
    writeButton.classList.remove("active");
    memoryForm.style.display = "none";
    updateMemoryDisplay();
    editIndex = null;
  }
}

// Function to add a memory to IndexedDB
function addMemoryToDB(memory) {
  var transaction = request.result.transaction(["memories"], "readwrite");
  var store = transaction.objectStore("memories");
  var addRequest = store.add(memory);

  addRequest.onsuccess = function () {
    loadMemoriesFromDB();
  };

  addRequest.onerror = function () {
    console.error("Error adding memory to IndexedDB.");
  };
}

// Function to update a memory in IndexedDB
function updateMemoryInDB(memory) {
  var transaction = request.result.transaction(["memories"], "readwrite");
  var store = transaction.objectStore("memories");
  var updateRequest = store.put(memory);

  updateRequest.onsuccess = function () {
    loadMemoriesFromDB();
  };

  updateRequest.onerror = function () {
    console.error("Error updating memory in IndexedDB.");
  };
}

// Function to delete a memory from IndexedDB
function deleteMemoryFromDB(id) {
  var transaction = request.result.transaction(["memories"], "readwrite");
  var store = transaction.objectStore("memories");
  var deleteRequest = store.delete(id);

  deleteRequest.onsuccess = function () {
    loadMemoriesFromDB();
  };

  deleteRequest.onerror = function () {
    console.error("Error deleting memory from IndexedDB.");
  };
}

// Function to load memories from IndexedDB
function loadMemoriesFromDB() {
  var transaction = request.result.transaction(["memories"], "readonly");
  var store = transaction.objectStore("memories");
  var getAllRequest = store.getAll();

  getAllRequest.onsuccess = function () {
    memories = getAllRequest.result;
    updateMemoryDisplay();
  };

  getAllRequest.onerror = function () {
    console.error("Error loading memories from IndexedDB.");
  };
}
