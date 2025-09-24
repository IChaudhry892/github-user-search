const searchButton = document.querySelector(".search-button");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.querySelector(".profile-container");
const searchErrorContainer = document.querySelector(".search-error-container");

// Event Listeners
searchButton.addEventListener("click", loadUserProfile);
usernameInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter")
        loadUserProfile();
})

// Handles profile search action (button click or Enter key).
// Gets the username from the input, fetches GitHub profile data,
// and updates the profile container with the retrieved information.
async function loadUserProfile() {
    const username = usernameInput.value.toLowerCase();

    // Hide profile and error containers when starting a new search
    searchErrorContainer.style.display = "none";
    profileContainer.style.display = "none";

    // Display error container for empty username input
    if (!username) {
        updateSearchErrorContainer("Error: Enter User");
        return;
    }

    try {
        const userData = await fetchUserData(username);
        updateProfileContainer(userData);

        const repoData = await fetchRepoData(username);
        console.log(repoData);
    } catch (error) {
        console.error(error);
        updateSearchErrorContainer("Error: User Not Found");
    }
}

// Fetches GitHub user data from the public API for a given username.
// Returns: JSON object containing profile details if successful.
// Throws: Error if the request fails (e.g., invalid username).
async function fetchUserData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `${username}`
            }
        });

        if (!response.ok) {
            throw new Error("Could not fetch user data");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Fetches GitHub user repo data from the public API for a given username.
// Returns: JSON object containing repo details if successful.
// Throws: Error if the request fails (e.g., invalid username).
async function fetchRepoData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `${username}`
            }
        });

        if (!response.ok) {
            throw new Error("Could not fetch user repo data");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Updates the h2 element inside the search error container with a custom error
// message and displays it.
// Used to show validation errors (empty input) or API errors (user not found).
// Takes an error message string and updates the error text element before showing
// the container.
function updateSearchErrorContainer(errorMessage) {
    document.getElementById("searchErrorText").textContent = errorMessage;
    searchErrorContainer.style.display = "block";
}

// Updates the DOM elements inside the profile container with GitHub user data.
// Populates avatar, username, join date, repos count, followers/following,
// and optional fields like location, Twitter handle, blog, and company.
// If a field is unavailable, "Not Available" is displayed instead.
function updateProfileContainer(data) {
    // Update basic profile info
    document.getElementById("userAvatar").src = data.avatar_url;
    document.getElementById("profileUsername").textContent = `@${data.login}`;
    document.getElementById("profileCreatedDate").textContent = `Member Since ${new Date(data.created_at).toDateString()}`;
    document.getElementById("viewProfileButton").href = data.html_url;

    // Update stats
    document.getElementById("publicReposCount").textContent = data.public_repos;
    document.getElementById("followersCount").textContent = data.followers;
    document.getElementById("followingCount").textContent = data.following;

    // Update bio fields with helper function
    updateBioField("locationLabel", "locationValue", data.location);
    updateBioField("twitterHandleLabel", "twitterHandleValue", data.twitter_username);
    updateBioField("blogLabel", "blogValue", data.blog);
    updateBioField("companyLabel", "companyValue", data.company);

    // Make profile container visible
    profileContainer.style.display = "flex";
}

// Helper function to update individual bio fields (location, Twitter, blog, company).
// If the data value is present, it sets the text and styles it normally.
// If absent, it sets the text to "Not Available".
function updateBioField(labelId, valueId, dataValue) {
    const labelElement = document.getElementById(labelId);
    const valueElement = document.getElementById(valueId);

    if (dataValue) {
        labelElement.style.color = "var(--color-text)";
        valueElement.style.color = "var(--color-text)";
        valueElement.textContent = dataValue;
    } else {
        valueElement.textContent = "Not Available";
    }
}

function updateRecentReposContainer() {

}