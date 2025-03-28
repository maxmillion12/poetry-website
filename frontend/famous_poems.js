document.addEventListener("DOMContentLoaded", function () {
    const favoritesKey = "favoritePoems";
    const timestampKey = "favoritesTimestamp";
    const favoriteSection = document.getElementById("favorites-list");
    const favoriteCount = document.getElementById("favorite-count");
    const sortFavorites = document.getElementById("sort-favorites");
    const clearFavoritesBtn = document.getElementById("clear-favorites");
    const poemList = document.getElementById("poemsContainer");
    const searchInput = document.getElementById("searchPoem");
    const loadMoreBtn = document.getElementById("loadMore");
    
    let poems = [];
    let displayedCount = 10; // Show first 10 poems initially

    // Function to get stored favorites
    function getFavorites() {
        return JSON.parse(sessionStorage.getItem(favoritesKey)) || [];
    }

    // Function to save favorites
    function saveFavorites(favorites) {
        sessionStorage.setItem(favoritesKey, JSON.stringify(favorites));
        sessionStorage.setItem(timestampKey, Date.now());
    }

    // Function to check if 24 hours have passed
    function checkFavoritesExpiry() {
        const lastSaved = sessionStorage.getItem(timestampKey);
        if (lastSaved) {
            const now = Date.now();
            const hoursPassed = (now - lastSaved) / (1000 * 60 * 60);
            if (hoursPassed >= 24) {
                sessionStorage.removeItem(favoritesKey);
                sessionStorage.removeItem(timestampKey);
            }
        }
    }

    // Function to toggle favorite
    function toggleFavorite(event) {
        let button = event.target;
        let title = button.getAttribute("data-title");
        let author = button.getAttribute("data-author");
        let link = button.getAttribute("data-link");

        let favorites = getFavorites();
        let existing = favorites.find(poem => poem.title === title);

        if (existing) {
            favorites = favorites.filter(poem => poem.title !== title);
            button.classList.remove("favorited"); // Remove styling
        } else {
            favorites.push({ title, author, link, timestamp: Date.now() });
            button.classList.add("favorited"); // Add styling
        }

        saveFavorites(favorites);
        updateFavoritesDisplay();
    }

    // Function to update the Favorites Section
    function updateFavoritesDisplay() {
        let favorites = getFavorites();
        favoriteSection.innerHTML = favorites.length
            ? favorites.map(poem => `<p><a href="${poem.link}" target="_blank">${poem.title} by ${poem.author}</a></p>`).join("")
            : "<p>No favorite poems yet.</p>";

        favoriteCount.textContent = favorites.length;

        // Update favorite button styles
        document.querySelectorAll(".favorite-btn").forEach(btn => {
            let title = btn.getAttribute("data-title");
            let isFavorited = favorites.some(poem => poem.title === title);
            btn.classList.toggle("favorited", isFavorited);
        });
    }

    // Function to Display Poems
    function displayPoems(poemsArray) {
        poemList.innerHTML = "";
        poemsArray.forEach(poem => {
            let poemDiv = document.createElement("div");
            poemDiv.classList.add("poem-item");
            poemDiv.innerHTML = `
                <h3>${poem.title}</h3>
                <p><strong>By:</strong> ${poem.author}</p>
                <a href="${poem.link}" target="_blank">Read More</a>
                <button class="favorite-btn" data-title="${poem.title}" data-author="${poem.author}" data-link="${poem.link}">❤ Favorite</button>
            `;
            poemList.appendChild(poemDiv);
        });

        // Attach event listeners to favorite buttons
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", toggleFavorite);
        });

        updateFavoritesDisplay();
    }

    document.addEventListener("DOMContentLoaded", function () {
        fetch("famous_poems.json") // Fetching directly from frontend/
            .then(response => response.json())
            .then(poems => displayPoems(poems))
            .catch(error => console.error("Error loading poems:", error));
    });
    
    function displayPoems(poems) {
        const poemsContainer = document.getElementById("poems-list");
    
        if (!poemsContainer) {
            console.error("Poems container not found!");
            return;
        }
    
        poemsContainer.innerHTML = ""; // Clear previous content
    
        poems.forEach(poem => {
            const poemElement = document.createElement("div");
            poemElement.classList.add("poem-item");
    
            poemElement.innerHTML = `
                <h3>${poem.title}</h3>
                <p><strong>By:</strong> ${poem.author}</p>
                <a href="${poem.link}" target="_blank">Read More</a>
                <button class="favorite-btn" data-title="${poem.title}" data-author="${poem.author}" data-link="${poem.link}">❤ Favorite</button>
            `;
    
            poemsContainer.appendChild(poemElement);
        });
    
        attachFavoriteListeners();
    }
    
    // Function to attach event listeners to favorite buttons
    function attachFavoriteListeners() {
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", toggleFavorite);
        });
    }
    
    // Load More Poems
    loadMoreBtn.addEventListener("click", () => {
        displayedCount += 10;
        displayPoems(poems.slice(0, displayedCount));
    });

    // Search Poems
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredPoems = poems.filter(poem =>
            poem.title.toLowerCase().includes(query) || poem.author.toLowerCase().includes(query)
        );
        displayPoems(filteredPoems);
    });

    // Sort Favorites
    sortFavorites.addEventListener("change", () => {
        let favorites = getFavorites();
        if (sortFavorites.value === "title") {
            favorites.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortFavorites.value === "author") {
            favorites.sort((a, b) => a.author.localeCompare(b.author));
        }
        saveFavorites(favorites);
        updateFavoritesDisplay();
    });

    // Clear Favorites
    clearFavoritesBtn.addEventListener("click", () => {
        sessionStorage.removeItem(favoritesKey);
        sessionStorage.removeItem(timestampKey);
        updateFavoritesDisplay();
    });

    // Check if 24 hours have passed and reset favorites
    checkFavoritesExpiry();

    // Initial display update
    updateFavoritesDisplay();
});
