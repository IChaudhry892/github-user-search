const searchButton = document.querySelector(".search-button");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.querySelector(".profile-container");
const searchErrorContainer = document.querySelector(".search-error-container");
const recentReposContainer = document.querySelector(".recent-repos-container");
const loadingContainer = document.querySelector(".loading-icon-container");

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

    // Hide profile, error, and recent repos containers when starting a new search
    searchErrorContainer.style.display = "none";
    profileContainer.style.display = "none";
    recentReposContainer.style.display = "none";

    // Display error container for empty username input
    if (!username) {
        updateSearchErrorContainer("Error: Enter User");
        return;
    }

    try {
        // Show loading icon while fetching data
        loadingContainer.style.display = "block";

        const userData = await fetchUserData(username);
        updateProfileContainer(userData);

        const repoData = await fetchRepoData(username);
        const recentRepos = getRecentRepos(repoData, "updated_at", 5);
        updateRecentReposContainer(recentRepos);
        
        // Hide loading icon after all data is loaded
        loadingContainer.style.display = "none";
    } catch (error) {
        console.error(error);
        loadingContainer.style.display = "none"; // Hide loading on error
        updateSearchErrorContainer("Error: User Not Found");
    }
}

// Fetches GitHub user data from the public API for a given username.
// Takes a username and endpoint path, returns JSON data if successful.
// Handles authentication headers and error responses consistently.
async function fetchGitHubData(username, endpoint) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `${username}`
            }
        });

        if (!response.ok) {
            throw new Error(`Could not fetch data for user ${username} from endpoint ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error; // Re-throw to let calling function handle it
    }
}

// Fetches GitHub user profile data for a given username.
// Returns: JSON object containing profile details if successful.
async function fetchUserData(username) {
    return await fetchGitHubData(username, "");
}

// Fetches GitHub user repository data for a given username.
// Returns: JSON array containing repo details if successful.
async function fetchRepoData(username) {
    return await fetchGitHubData(username, "/repos");
}

function getRecentRepos(repoData, orderBy, count) {
    const sortedRepos = repoData.sort(function (a, b) {
        return new Date(b[orderBy]) - new Date(a[orderBy])
    })
    const recentRepos = sortedRepos.slice(0, count);
    return recentRepos;
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
        labelElement.style.color = "var(--color-text-tertiary)";
        valueElement.style.color = "var(--color-text-tertiary)";
        valueElement.textContent = "Not Available";
    }
}

function updateRecentReposContainer(recentRepos) {
    recentReposContainer.innerHTML = "";

    recentRepos.forEach((repo) => {
        const repoElement = createRepoElement(repo);
        recentReposContainer.appendChild(repoElement);
    });

    recentReposContainer.style.display = "flex";
}

function createRepoElement(repo) {
    const repoDiv = document.createElement("div");
    repoDiv.className = "repo";

    repoDiv.innerHTML = `
        <div class="repo-name-section">
            <a class="repo-link" href=${repo.html_url} target="_blank">${repo.name}</a>
        </div>
        <div class="repo-stats-section">
            <div class="repo-stat">
                <p id="languageLabel">Language:</p><p id="languageValue" class="repo-stat-value">${repo.language}</p>
            </div>
            <div class="repo-stat">
                <p id="starsLabel">Stars:</p><p id="starsValue" class="repo-stat-value">${repo.stargazers_count}</p>
            </div>
            <div class="repo-stat">
                <p id="watchersLabel">Watchers:</p><p id="watchersValue" class="repo-stat-value">${repo.watchers_count}</p>
            </div>
            <div class="repo-stat">
                <p id="forksLabel">Forks:</p><p id="forksValue" class="repo-stat-value">${repo.forks_count}</p>
            </div>
        </div>
    `;

    return repoDiv;
}