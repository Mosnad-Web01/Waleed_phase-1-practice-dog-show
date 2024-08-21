document.addEventListener("DOMContentLoaded", () => {
  fetchDogs();

  const dogForm = document.getElementById("dog-form");
  dogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const dogId = event.target.dataset.id;
    const updatedDog = {
      name: event.target.name.value,
      breed: event.target.breed.value,
      sex: event.target.sex.value,
    };
    updateDog(dogId, updatedDog);
  });
});

// Function to fetch dogs from the API
const fetchDogs = () => {
  fetch("http://localhost:3000/dogs")
    .then((response) => response.json())
    .then(renderDogs)
    .catch((error) => {
      console.error("Error fetching dogs:", error);
      alert("Failed to fetch dogs. Please try again later.");
    });
};

// Function to render dogs in the table
const renderDogs = (dogs) => {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ""; // Clear previous entries

  dogs.forEach((dog) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td><button data-id="${dog.id}" class="edit-button">Edit</button></td>
    `;
    tableBody.appendChild(row);
  });

  // Attach event listeners to Edit buttons
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", handleEditClick);
  });
};

// Function to handle editing a dog
const handleEditClick = (event) => {
  const dogId = event.target.dataset.id;
  fetch(`http://localhost:3000/dogs/${dogId}`)
    .then((response) => response.json())
    .then((dog) => {
      const dogForm = document.getElementById("dog-form");
      dogForm.name.value = dog.name;
      dogForm.breed.value = dog.breed;
      dogForm.sex.value = dog.sex;
      dogForm.dataset.id = dog.id; // Store dog ID in the form
    })
    .catch((error) => {
      console.error("Error fetching dog for edit:", error);
      alert("Failed to fetch dog details. Please try again.");
    });
};

// Function to update dog information
const updateDog = (id, dogData) => {
  fetch(`http://localhost:3000/dogs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dogData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(() => {
      fetchDogs(); // Refresh the dog list
      clearForm(); // Clear the form after submission
    })
    .catch((error) => {
      console.error("Error updating dog:", error);
      alert("Failed to update dog. Please check your input and try again.");
    });
};

// Function to clear the form fields
const clearForm = () => {
  const dogForm = document.getElementById("dog-form");
  dogForm.reset();
  delete dogForm.dataset.id; // Remove dog ID from the form
};
