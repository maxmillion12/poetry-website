document.addEventListener("DOMContentLoaded", function () {
    const categories = [
        "Adventure", "Abstract", "Beauty", "Betrayal", "Courage", "Darkness", "Death",
        "Destiny", "Dreams", "Faith", "Family", "Fantasy", "Friendship", "Grief",
        "Happiness", "Heartbreak", "History", "Hope", "Inspiration", "Joy", "Life",
        "Light", "Longing", "Love", "Magic", "Memory", "Motivation", "Music", "Mystery",
        "Nature", "Night", "Peace", "Regret", "Romance", "Sadness", "Seasons",
        "Self-Discovery", "Silence", "Spiritual", "Time", "Truth", "War", "Wisdom"
    ].sort(); // Sort alphabetically

    const categorySelect = document.getElementById("categories");
    const categorySearch = document.getElementById("categorySearch");
    const selectedCategoriesBox = document.getElementById("selectedCategories");
    let selectedCategories = [];

    // Load categories in order
    function loadCategories() {
        categorySelect.innerHTML = "";
        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Filter categories based on user input
    window.filterCategories = function () {
        let query = categorySearch.value.toLowerCase();
        categorySelect.innerHTML = "";
        categories.forEach(category => {
            if (category.toLowerCase().includes(query)) {
                let option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            }
        });
    };

    // Add selected categories to the text box
    categorySelect.addEventListener("change", function () {
        let selectedOptions = Array.from(categorySelect.selectedOptions).map(option => option.value);

        selectedOptions.forEach(category => {
            if (!selectedCategories.includes(category)) {
                selectedCategories.push(category);
            }
        });

        selectedCategoriesBox.value = selectedCategories.join(", ");
    });

    // Handle form submission
    document.getElementById("submitPoemForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let poemTitle = document.getElementById("poemTitle").value;
        let poemContent = document.getElementById("poemContent").value;

        if (selectedCategories.length === 0) {
            alert("Please select at least one category.");
            return;
        }

        let poemData = {
            username,
            email,
            poemTitle,
            poemContent,
            categories: selectedCategories
        };

        console.log("Poem Submitted:", poemData);
        alert("Poem submitted successfully!");
    });

    loadCategories();
});

fetch("http://localhost:3000/famous_poems.json")
  .then(response => response.json())
  .then(data => {
    console.log("Poems loaded:", data); // Debugging
    displayPoems(data);
  })
  .catch(error => console.error("Error loading poems:", error));
