document.getElementById("poetryForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let poemTitle = document.getElementById("poemTitle").value.trim();
    let poem = document.getElementById("poem").value.trim();
    let errorMessage = document.getElementById("errorMessage");

    if (username === "" || email === "" || poemTitle === "" || poem === "") {
        errorMessage.textContent = "Please fill in all fields before submitting.";
    } else {
        errorMessage.textContent = ""; // Clear error message
        alert("Poem submitted successfully!");
        this.reset(); // Clear form
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".signup-section");
    const poemContainer = document.getElementById("poems-container");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get user input
        const username = document.querySelector("#username").value;
        const title = document.querySelector("#title").value;
        const poem = document.querySelector("#poem").value;

        if (username && title && poem) {
            // Create new poem entry
            const poemEntry = document.createElement("div");
            poemEntry.innerHTML = `<h3>${title} - <i>${username}</i></h3><p>${poem}</p>`;
            poemContainer.prepend(poemEntry);

            // Clear form
            form.reset();
        }
    });
});
// Select all poems
document.querySelectorAll(".poem").forEach(poem => {
    let likeButton = poem.querySelector(".likeButton");
    let loveButton = poem.querySelector(".loveButton");
    let likeCount = poem.querySelector(".likeCount");
    let loveCount = poem.querySelector(".loveCount");

    let likeCounter = 0;
    let loveCounter = 0;

    // When Like Button is clicked, increase count
    likeButton.addEventListener("click", function() {
        likeCounter++;
        likeCount.textContent = likeCounter;
    });

    // When Love Button is clicked, increase count
    loveButton.addEventListener("click", function() {
        loveCounter++;
        loveCount.textContent = loveCounter;
    });
});
const cors = require("cors");
app.use(cors());
const backendURL = "http://localhost:3000/api/auth"; // Adjust URL if needed

// Function to Register a New User
async function signUpUser(username, email, password) {
    try {
        const response = await fetch(`${backendURL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log("Signup Response:", data);

        if (response.ok) {
            alert("Signup successful! You can now log in.");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Signup Error:", error);
    }
}

// Function to Login a User
async function loginUser(email, password) {
    try {
        const response = await fetch(`${backendURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Login Response:", data);

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("token", data.token); // Save token for authentication
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Signup form handling
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful!");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        });
    }

    // Login form handling
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            alert("Logged out!");
            window.location.href = "login.html";
        });
    }
    
});

async function fetchRecentPoems() {
    try {
        const response = await fetch('http://localhost:3000/api/poems');
        const poems = await response.json();

        const poemsContainer = document.getElementById('poems-container');
        poemsContainer.innerHTML = ''; // Clear old content

        poems.forEach(poem => {
            const poemElement = document.createElement('div');
            poemElement.classList.add('poem');
            poemElement.innerHTML = `
                <h3>${poem.title}</h3>
                <p><strong>By:</strong> ${poem.username}</p>
                <p>${poem.content.substring(0, 100)}...</p>
            `;
            poemsContainer.appendChild(poemElement);
        });
    } catch (error) {
        console.error('Error fetching poems:', error);
    }
}

// Call function when page loads
document.addEventListener('DOMContentLoaded', fetchRecentPoems);

const categories = [
    "Love", "Life", "Nature", "Friendship", "Sadness", "Happiness", "Motivation", "Hope",
    "Dreams", "Heartbreak", "Wisdom", "Spiritual", "Romance", "Family", "Relationships",
    "Inspiration", "Grief", "Self-Love", "Adventure", "Memories", "Fantasy", "War", "Peace",
    "Loneliness", "Growth", "Betrayal", "Regret", "Forgiveness", "Freedom", "Music",
    "Childhood", "Strength", "Faith", "Beauty", "Seasons", "Youth", "Mystery", "Truth",
    "Courage", "Loss", "Fear", "Destiny", "Survival", "Passion", "Patience", "Time",
    "Silence", "Wanderlust", "Chaos", "Healing", "Light", "Darkness"
];

function displayCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.textContent = category;
        
        // Click event (Filter poems by category)
        categoryElement.addEventListener('click', () => {
            alert(`Filtering poems under: ${category}`);
            // Future: Fetch poems by category from backend
        });

        categoriesContainer.appendChild(categoryElement);
    });
}

// Run function when page loads
document.addEventListener('DOMContentLoaded', displayCategories);
document.addEventListener("DOMContentLoaded", () => {
    const categories = [
        "Love", "Life", "Nature", "Friendship", "Sadness", "Happiness", "Motivation", "Hope",
        "Dreams", "Heartbreak", "Wisdom", "Spiritual", "Romance", "Family", "Relationships",
        "Inspiration", "Grief", "Self-Love", "Adventure", "Memories", "Fantasy", "War", "Peace",
        "Loneliness", "Growth", "Betrayal", "Regret", "Forgiveness", "Freedom", "Music",
        "Childhood", "Strength", "Faith", "Beauty", "Seasons", "Youth", "Mystery", "Truth",
        "Courage", "Loss", "Fear", "Destiny", "Survival", "Passion", "Patience", "Time",
        "Silence", "Wanderlust", "Chaos", "Healing", "Light", "Darkness"
    ];

    const categorySelect = document.getElementById("categorySelect");

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const categories = [
        "Love", "Life", "Nature", "Friendship", "Sadness", "Happiness", "Motivation", "Hope",
        "Dreams", "Heartbreak", "Wisdom", "Spiritual", "Romance", "Family", "Relationships",
        "Inspiration", "Grief", "Self-Love", "Adventure", "Memories", "Fantasy", "War", "Peace",
        "Loneliness", "Growth", "Betrayal", "Regret", "Forgiveness", "Freedom", "Music",
        "Childhood", "Strength", "Faith", "Beauty", "Seasons", "Youth", "Mystery", "Truth",
        "Courage", "Loss", "Fear", "Destiny", "Survival", "Passion", "Patience", "Time",
        "Silence", "Wanderlust", "Chaos", "Healing", "Light", "Darkness"
    ];

    const categorySelect = document.getElementById("categorySelect");

    if (categorySelect) {
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.toLowerCase();
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const poetryForm = document.getElementById("poetryForm");
    const recentPoemsDiv = document.getElementById("recentPoems");

    poetryForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page

        // Get input values
        const username = poetryForm.querySelector("input[type='text']").value;
        const email = poetryForm.querySelector("input[type='email']").value;
        const title = poetryForm.querySelector("input[placeholder='Enter the poem title']").value;
        const poem = poetryForm.querySelector("textarea").value;
        const category = document.getElementById("categorySelect").value;

        if (!title || !poem || !category) {
            alert("Please fill in the title, poem, and select a category.");
            return;
        }

        // Create a new poem entry
        const poemEntry = document.createElement("div");
        poemEntry.classList.add("poem-entry");
        poemEntry.innerHTML = `
            <h3>${title}</h3>
            <p><strong>By:</strong> ${username || "Anonymous"}</p>
            <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <p>${poem}</p>
            <hr>
        `;

        // Add the new poem to the top of the "Recent Poems" section
        recentPoemsDiv.prepend(poemEntry);

        // Clear the form after submission
        poetryForm.reset();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const poetryForm = document.getElementById("poetryForm");
    const recentPoemsDiv = document.getElementById("recentPoems");

    // Initialize Firebase (Make sure you've set this up in Firebase console)
    const firebaseConfig = {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
        appId: "YOUR_FIREBASE_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    poetryForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents the form from refreshing

        // Get input values
        const username = poetryForm.querySelector("input[type='text']").value || "Anonymous";
        const email = poetryForm.querySelector("input[type='email']").value;
        const title = poetryForm.querySelector("input[placeholder='Enter the poem title']").value;
        const poem = poetryForm.querySelector("textarea").value;
        const category = document.getElementById("categorySelect").value;

        if (!title || !poem || !category) {
            alert("Please fill in the title, poem, and select a category.");
            return;
        }

        // Save to Firebase
        db.collection("poems").add({
            username,
            email,
            title,
            poem,
            category,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("Poem saved successfully!");
            poetryForm.reset();
            loadRecentPoems(); // Reload poems
        })
        .catch((error) => console.error("Error saving poem: ", error));
    });

    // Function to load recent poems
    function loadRecentPoems() {
        recentPoemsDiv.innerHTML = ""; // Clear before reloading

        db.collection("poems").orderBy("timestamp", "desc").limit(10).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const poemData = doc.data();
                const poemEntry = document.createElement("div");
                poemEntry.classList.add("poem-entry");
                poemEntry.innerHTML = `
                    <h3>${poemData.title}</h3>
                    <p><strong>By:</strong> ${poemData.username}</p>
                    <p><strong>Category:</strong> ${poemData.category.charAt(0).toUpperCase() + poemData.category.slice(1)}</p>
                    <p>${poemData.poem}</p>
                    <hr>
                `;
                recentPoemsDiv.appendChild(poemEntry);
            });
        })
        .catch((error) => console.error("Error loading poems: ", error));
    }

    // Load poems when page loads
    loadRecentPoems();
});
document.addEventListener("DOMContentLoaded", function () {
    const categoryButtons = document.querySelectorAll(".category-btn");

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            loadPoemsByCategory(category);
        });
    });

    function loadPoemsByCategory(category) {
        const recentPoemsDiv = document.getElementById("recentPoems");
        recentPoemsDiv.innerHTML = ""; // Clear before reloading

        let query = db.collection("poems").orderBy("timestamp", "desc");
        if (category !== "all") {
            query = query.where("category", "==", category);
        }

        query.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const poemData = doc.data();
                const poemEntry = document.createElement("div");
                poemEntry.classList.add("poem-entry");
                poemEntry.innerHTML = `
                    <h3>${poemData.title}</h3>
                    <p><strong>By:</strong> ${poemData.username}</p>
                    <p><strong>Category:</strong> ${poemData.category.charAt(0).toUpperCase() + poemData.category.slice(1)}</p>
                    <p>${poemData.poem}</p>
                    <hr>
                `;
                recentPoemsDiv.appendChild(poemEntry);
            });
        })
        .catch((error) => console.error("Error filtering poems: ", error));
    }
});
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch user profile data from backend
        const response = await fetch("http://localhost:3000/api/user/profile", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return;
        }

        // Update profile page with user data
        document.getElementById("username").textContent = data.username || "No username";
        document.getElementById("user-bio").textContent = data.bio || "No bio available";
        document.getElementById("profile-pic").src = data.profilePicture || "default-profile.png";

        // Display user's poems
        const poemsList = document.getElementById("poems-list");
        poemsList.innerHTML = ""; // Clear previous content
        if (data.poems.length === 0) {
            poemsList.innerHTML = "<p>No poems yet.</p>";
        } else {
            data.poems.forEach(poem => {
                const poemDiv = document.createElement("div");
                poemDiv.innerHTML = `<strong>${poem.title}</strong> - ${poem.content}`;
                poemsList.appendChild(poemDiv);
            });
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    let allCategories = [
        "Nature", "Love", "Inspiration", "Friendship", "Motivation", "Adventure", "Hope", "Wisdom",
        "Childhood", "Courage", "Dreams", "Faith", "Family", "Freedom", "Happiness", "Heartbreak",
        "Imagination", "Life", "Memories", "Music", "Peace", "Rain", "Romance", "Seasons", "Silence",
        "Stars", "Strength", "Sunrise", "Tears", "Time", "Travel", "Trust", "War", "Youth", 
        // ... Add more categories up to 500+ ...
    ];

    let defaultCategories = allCategories.slice(0, 5); // Show only 5 initially
    let categoriesList = document.getElementById("categoriesList");
    let categorySearch = document.getElementById("categorySearch");

    function displayCategories(categories) {
        categoriesList.innerHTML = ""; // Clear previous list
        categories.forEach(category => {
            let label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" name="category" value="${category}"> ${category}`;
            categoriesList.appendChild(label);
            categoriesList.appendChild(document.createElement("br"));
        });
    }

    // Show default categories initially
    displayCategories(defaultCategories);

    // Search categories
    categorySearch.addEventListener("input", function () {
        let searchTerm = categorySearch.value.toLowerCase();
        let filteredCategories = allCategories.filter(category =>
            category.toLowerCase().includes(searchTerm)
        );

        displayCategories(filteredCategories.slice(0, 20)); // Limit results to 20
    });

    // Save Selected Categories
    document.getElementById("saveCategories").addEventListener("click", function () {
        let selectedCategories = [];
        document.querySelectorAll("input[name='category']:checked").forEach((checkbox) => {
            selectedCategories.push(checkbox.value);
        });

        if (selectedCategories.length > 0) {
            document.getElementById("selectedCategories").textContent = selectedCategories.join(", ");
        } else {
            document.getElementById("selectedCategories").textContent = "No category selected";
        }
    });
});

