document.addEventListener("DOMContentLoaded", async function () {
    try {
        // ✅ Fetch User Profile Data
        const response = await fetch("http://localhost:3000/api/user/profile", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        console.log(data); // Debugging step - check in console

        if (!data || data.error) {
            console.error("Profile data error:", data.error || "No data received");
            return;
        }

        // ✅ Set Profile Details
        document.getElementById("username").textContent = data.username || "No username";
        document.getElementById("user-bio").textContent = data.bio || "No bio available";
        document.getElementById("profile-pic").src = data.profilePicture || "default-profile.png";

        // ✅ Display User's Poems
        const poemsList = document.getElementById("poems-list");
        poemsList.innerHTML = "";
        if (data.poems && data.poems.length > 0) {
            data.poems.forEach(poem => {
                const poemDiv = document.createElement("div");
                poemDiv.innerHTML = `
                    <strong>${poem.title}</strong> - ${poem.content}
                    <button class="favorite-btn" data-title="${poem.title}">❤️</button>
                `;
                poemsList.appendChild(poemDiv);
            });
        } else {
            poemsList.innerHTML = "<p>No poems found.</p>";
        }

        // ✅ Handle Favorite Poems (Persistent with localStorage)
        const favoriteButtons = document.querySelectorAll(".favorite-btn");
        const favoritesList = document.getElementById("favorites-list");
        let favorites = new Set(JSON.parse(localStorage.getItem("favoritePoems")) || []);

        favoriteButtons.forEach(button => {
            const poemTitle = button.getAttribute("data-title");

            if (favorites.has(poemTitle)) {
                button.classList.add("favorited");
            }

            button.addEventListener("click", function () {
                if (favorites.has(poemTitle)) {
                    favorites.delete(poemTitle);
                    button.classList.remove("favorited");
                } else {
                    favorites.add(poemTitle);
                    button.classList.add("favorited");
                }
                localStorage.setItem("favoritePoems", JSON.stringify([...favorites]));
                updateFavoritesDisplay();
            });
        });

        function updateFavoritesDisplay() {
            favoritesList.innerHTML = "";
            if (favorites.size > 0) {
                favorites.forEach(title => {
                    const favDiv = document.createElement("div");
                    favDiv.textContent = title;
                    favoritesList.appendChild(favDiv);
                });
            } else {
                favoritesList.innerHTML = "<p>No favorite poems yet.</p>";
            }
        }
        updateFavoritesDisplay();

    } catch (error) {
        console.error("Error fetching profile data:", error);
    }

    // ✅ Profile Editing Functionality
    const editProfileBtn = document.getElementById("edit-profile");
    const modal = document.getElementById("edit-profile-modal");
    const closeModal = document.querySelector(".close");

    editProfileBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // ✅ Handle Profile Update Submission
    document.getElementById("edit-profile-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const newUsername = document.getElementById("new-username").value.trim();
        const newBio = document.getElementById("new-bio").value.trim();
        const newProfilePic = document.getElementById("new-profile-pic").files[0];

        const formData = new FormData();
        if (newUsername) formData.append("username", newUsername);
        if (newBio) formData.append("bio", newBio);
        if (newProfilePic) formData.append("profilePicture", newProfilePic);

        try {
            const response = await fetch("http://localhost:3000/api/user/update", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                alert("Profile updated successfully!");
                location.reload();
            } else {
                alert("Failed to update profile: " + result.error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });

    // ✅ Profile Picture Upload (Persistent)
    const profilePic = document.getElementById("profile-pic");
    const uploadPicInput = document.getElementById("upload-pic");
    const changePicButton = document.getElementById("change-pic-btn");

    changePicButton.addEventListener("click", function () {
        uploadPicInput.click();
    });

    uploadPicInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;
                localStorage.setItem("profilePicture", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    const savedProfilePic = localStorage.getItem("profilePicture");
    if (savedProfilePic) {
        profilePic.src = savedProfilePic;
    }

    // ✅ Load User Social Media Links
    async function loadSocialLinks(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${userId}`);
            const userData = await response.json();

            if (userData.socialLinks) {
                document.getElementById("twitter-link").href = userData.socialLinks.twitter || "#";
                document.getElementById("instagram-link").href = userData.socialLinks.instagram || "#";
                document.getElementById("facebook-link").href = userData.socialLinks.facebook || "#";
            }
        } catch (error) {
            console.error("Error loading social media links:", error);
        }
    }

    const userId = "USER_ID"; // Replace with actual user ID
    loadSocialLinks(userId);

    // ✅ Handle Profile Update (Including Social Links)
    document.getElementById("edit-profile-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const newTwitter = document.getElementById("new-twitter").value.trim();
        const newInstagram = document.getElementById("new-instagram").value.trim();
        const newFacebook = document.getElementById("new-facebook").value.trim();

        const formData = new FormData();
        if (newTwitter) formData.append("socialLinks[twitter]", newTwitter);
        if (newInstagram) formData.append("socialLinks[instagram]", newInstagram);
        if (newFacebook) formData.append("socialLinks[facebook]", newFacebook);

        try {
            const response = await fetch("http://localhost:3000/api/user/update", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                alert("Profile updated successfully!");
                location.reload();
            } else {
                alert("Failed to update profile: " + result.error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });

    // ✅ Logout Functionality
    document.getElementById("logout").addEventListener("click", async function () {
        try {
            await fetch("http://localhost:3000/api/user/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.clear();
            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
});
