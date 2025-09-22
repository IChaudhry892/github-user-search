const searchButton = document.querySelector(".search-button");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.querySelector(".profile-container");

// Event Listeners
searchButton.addEventListener("click", loadUserProfile);
usernameInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter")
        loadUserProfile();
})

// Profile Handler Function
async function loadUserProfile() {
    const username = usernameInput.value.toLowerCase();

    try {
        const data = await fetchData(username);
        updateProfileContainer(data);
    } catch (error) {
        console.error(error);
    }
}

// GitHub API Fetch Function
async function fetchData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Update Profile Container Function
function updateProfileContainer(data) {
    const userAvatar = document.getElementById("userAvatar");
    userAvatar.src = data.avatar_url;

    const profileUsername = document.getElementById("profileUsername");
    profileUsername.textContent = `@${data.login}`;

    const profileCreatedDate = document.getElementById("profileCreatedDate");
    const createdDate = new Date(data.created_at);
    profileCreatedDate.textContent = `Member Since ${createdDate.toDateString()}`;

    const publicReposCount = document.getElementById("publicReposCount");
    publicReposCount.textContent = data.public_repos;

    const followersCount = document.getElementById("followersCount");
    followersCount.textContent = data.followers;

    const followingCount = document.getElementById("followingCount");
    followingCount.textContent = data.following;

    const locationValue = document.getElementById("locationValue");
    if (data.location) {
        document.getElementById("locationLabel").style.color = "var(--color-text)";
        locationValue.style.color = "var(--color-text)";
        locationValue.textContent = data.location;
    } else {
        locationValue.textContent = "Not Available";
    }

    const twitterHandleValue = document.getElementById("twitterHandleValue");
    if (data.twitter_username) {
        document.getElementById("twitterHandleLabel").style.color = "var(--color-text)";
        twitterHandleValue.style.color = "var(--color-text)";
        twitterHandleValue.textContent = `@${data.twitter_username}`;
    } else {
        twitterHandleValue.textContent = "Not Available";
    }

    const blogValue = document.getElementById("blogValue");
    if (data.blog) {
        document.getElementById("blogLabel").style.color = "var(--color-text)";
        blogValue.style.color = "var(--color-text)";
        blogValue.textContent = data.blog;
    } else {
        blogValue.textContent = "Not Available";
    }

    const companyValue = document.getElementById("companyValue");
    if (data.company) {
        document.getElementById("companyLabel").style.color = "var(--color-text)";
        companyValue.style.color = "var(--color-text)";
        companyValue.textContent = data.company;
    } else {
        companyValue.textContent = "Not Available";
    }

    profileContainer.style.display = "flex";
}