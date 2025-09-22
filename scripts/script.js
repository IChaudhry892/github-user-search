const searchButton = document.querySelector(".search-button");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.querySelector(".profile-container");

// Event Listeners
searchButton.addEventListener("click", fetchData);
usernameInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter")
        fetchData();
})

// GitHub API fetch function
async function fetchData() {
    try {
        const username = usernameInput.value.toLowerCase();

        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        console.log(data);
        const userAvatar = data.avatar_url;
        const imgElement = document.getElementById("userAvatar");

        imgElement.src = userAvatar;
        profileContainer.style.display = "flex";
    }
    catch(error) {
        console.error(error);
    }
}