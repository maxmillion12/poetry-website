document.addEventListener("DOMContentLoaded", function () {
    const userNameSpan = document.getElementById("userName");
    const userEmailSpan = document.getElementById("userEmail");
    const userPoemsDiv = document.getElementById("userPoems");

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userNameSpan.textContent = user.displayName || "User";
            userEmailSpan.textContent = user.email;

            // Fetch user's poems from Firestore
            db.collection("poems")
                .where("email", "==", user.email) // Get only poems by this user
                .orderBy("timestamp", "desc")
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        userPoemsDiv.innerHTML = "<p>No poems submitted yet.</p>";
                        return;
                    }

                    querySnapshot.forEach((doc) => {
                        const poemData = doc.data();
                        const poemEntry = document.createElement("div");
                        poemEntry.classList.add("poem-entry");
                        poemEntry.innerHTML = `
                            <h3>${poemData.title}</h3>
                            <p><strong>Category:</strong> ${poemData.category}</p>
                            <p>${poemData.poem}</p>
                            <button onclick="deletePoem('${doc.id}')">Delete</button>
                            <hr>
                        `;
                        userPoemsDiv.appendChild(poemEntry);
                    });
                })
                .catch((error) => console.error("Error loading user poems:", error));
        } else {
            window.location.href = "login.html"; // Redirect to login if not authenticated
        }
    });
});

// Function to delete a poem
function deletePoem(poemId) {
    db.collection("poems").doc(poemId).delete()
        .then(() => {
            console.log("Poem deleted successfully!");
            location.reload(); // Refresh to update the list
        })
        .catch((error) => console.error("Error deleting poem:", error));
}
document.getElementById("logoutBtn").addEventListener("click", function () {
    firebase.auth().signOut().then(() => {
        console.log("User signed out.");
        window.location.href = "login.html"; // Redirect to login page
    }).catch((error) => console.error("Error signing out:", error));
});
