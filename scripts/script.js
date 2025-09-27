// ==== CONSTANTS ====
const ERROR_MESSAGES = {
    EMPTY_USERNAME: "Error: Enter User",
    USER_NOT_FOUND: "Error: User Not Found",
    API_ERROR: "Error: Unable to fetch data"
};

const SORT_REPOS_BY = {
    UPDATED: "updated_at",
    CREATED: "created_at",
    PUSHED: "pushed_at"
}


// ==== DOM ELEMENT REFERENCES ====
const searchButton = document.querySelector(".search-button");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.querySelector(".profile-container");
const searchErrorContainer = document.querySelector(".search-error-container");
const recentReposContainer = document.querySelector(".recent-repos-container");


// ==== EVENT LISTENERS ====
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

    // Reset UI state when starting a new search
    hideAllContainers();

    // Display error container for empty username input
    if (!username) {
        updateSearchErrorContainer(ERROR_MESSAGES.EMPTY_USERNAME);
        return;
    }

    try {
        // Show loading icon while fetching data
        createLoadingIcon();

        const userData = await fetchUserData(username);
        updateProfileContainer(userData);

        const repoData = await fetchRepoData(username);
        const recentRepos = getRecentRepos(repoData, SORT_REPOS_BY.UPDATED, 5);
        updateRecentReposContainer(recentRepos);
    } catch (error) {
        console.error(error);
        // Hide loading on error
        profileContainer.style.display = "none";
        updateSearchErrorContainer(ERROR_MESSAGES.USER_NOT_FOUND);
    }
}


// ==== API FUNCTIONS ====
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
            throw new Error(ERROR_MESSAGES.API_ERROR);
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

// Sorts repository data by a specified date field and returns the most recent ones.
// Takes repo array, sort field (e.g., "updated_at"), and desired count.
// Returns array of repositories sorted by most recent first, limited to specified count.
function getRecentRepos(repoData, orderBy, count) {
    const sortedRepos = repoData.sort(function (a, b) {
        return new Date(b[orderBy]) - new Date(a[orderBy])
    })
    const recentRepos = sortedRepos.slice(0, count);
    return recentRepos;
}


// ==== UI UPDATE FUNCTIONS ====
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
    createProfileContent();
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

// Clears existing repo elements and creates new ones from recent repos data.
// Dynamically generates repo HTML structure and populates with GitHub repo data.
// Shows the repos container after all elements are created and added.
function updateRecentReposContainer(recentRepos) {
    recentReposContainer.innerHTML = "";

    recentRepos.forEach((repo) => {
        const repoElement = createRepoElement(repo);
        recentReposContainer.appendChild(repoElement);
    });

    recentReposContainer.style.display = "flex";
}


// ==== HELPER FUNCTIONS ====
// Hides all main containers to reset UI state
function hideAllContainers() {
    searchErrorContainer.style.display = "none";
    profileContainer.style.display = "none";
    recentReposContainer.style.display = "none";
}

// Clears existing elements in the profile container.
// Generates a loading icon inside the profile container then makes the
// container visible.
function createLoadingIcon() {
    profileContainer.innerHTML = '';
    const loadingIcon = `
        <div class="loading-icon">
          <img class="loading-icon-gif" src="images/pikachu-running.gif" alt="Loading...">
        </div>
    `;
    profileContainer.innerHTML = loadingIcon;
    profileContainer.style.display = "flex";
}

// Clears existing elements in the profile container.
// Generates a user's profile content inside the profile container.
function createProfileContent() {
    profileContainer.innerHTML = '';
    const profileContent = `
        <div class="profile-picture-section">
            <img src="" alt="User Avatar" id="userAvatar">
            <a class="view-profile-button" id="viewProfileButton" href="" target="_blank">View Profile</a>
        </div>

        <div class="profile-info-section">
          <div class="profile-info-header">
            <p class="profile-username" id="profileUsername">@username</p>
            <p class="profile-created-date" id="profileCreatedDate">Member Since XX Mon XXXX</p>
          </div>
          <div class="profile-info-stats">
            <div class="stat-item">
              <p class="stat-name">Public Repos</p>
              <p class="stat-count" id="publicReposCount">X</p>
            </div>
            <div class="stat-item">
              <p class="stat-name">Followers</p>
              <p class="stat-count" id="followersCount">X</p>
            </div>
            <div class="stat-item">
              <p class="stat-name">Following</p>
              <p class="stat-count" id="followingCount">X</p>
            </div>
          </div>
          <div class="profile-info-bio">
            <div class="bio-grid">
              <div class="bio-grid-item">
                <p id="locationLabel">Location:</p><p id="locationValue" class="bio-grid-item-value">locationName</p>
              </div>
              <div class="bio-grid-item">
                <p id="twitterHandleLabel">Twitter:</p><p id="twitterHandleValue" class="bio-grid-item-value">@twitterHandle</p>
              </div>
              <div class="bio-grid-item">
                <p id="blogLabel">Blog:</p><p id="blogValue" class="bio-grid-item-value">blogURL</p>
              </div>
              <div class="bio-grid-item">
                <p id="companyLabel">Company:</p><p id="companyValue" class="bio-grid-item-value">companyName</p>
              </div>
            </div>
          </div>
        </div>
    `;
    profileContainer.innerHTML = profileContent;
}

// Creates a single repo element with complete HTML structure and styling.
// Populates repo name as clickable link, language, stars, watchers, and forks.
// Returns fully constructed DOM element ready to be appended to container.
function createRepoElement(repo) {
    const repoDiv = document.createElement("div");
    repoDiv.className = "repo";

    repoDiv.innerHTML = `
        <div class="repo-name-section">
            <a class="repo-link" href=${repo.html_url} target="_blank">${repo.name}</a>
        </div>
        <div class="repo-stats-section">
            <div class="repo-stat">
                <p id="languageLabel">Language:</p><p id="languageValue" class="repo-stat-value">${repo.language || "Not available"}</p>
            </div>
            <div class="repo-stat">
                <p id="starsLabel">Stars:</p><p id="starsValue" class="repo-stat-value">${repo.stargazers_count || "Not available"}</p>
            </div>
            <div class="repo-stat">
                <p id="watchersLabel">Watchers:</p><p id="watchersValue" class="repo-stat-value">${repo.watchers_count || "Not available"}</p>
            </div>
            <div class="repo-stat">
                <p id="forksLabel">Forks:</p><p id="forksValue" class="repo-stat-value">${repo.forks_count || "Not available"}</p>
            </div>
        </div>
    `;
    return repoDiv;
}