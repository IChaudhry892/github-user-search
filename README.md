# GitHub User Search

A web application that allows users to search for GitHub profiles and view detailed information about users and their repositories.

## 🚀 Live Demo

[View Live Site](https://magenta-pastelito-6c925d.netlify.app/)

## 📋 Features

- **User Profile Search**: Search for any GitHub user by username
- **Profile Information Display**: 
  - User avatar and profile link
  - Join date and account statistics
  - Public repositories, followers, and following counts
  - Personal details (location, blog, Twitter, company) when available
- **Recent Repositories**: View the 5 most recently updated repositories with:
  - Repository name and direct link
  - Programming language
  - Stars, watchers, and forks count
- **Loading States**: Visual feedback with animated loading indicator
- **Error Handling**: Clear error messages for invalid usernames or API issues

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Async/await, DOM manipulation, and API integration
- **GitHub REST API**: Real-time data fetching

## 🏗️ Project Structure

```
├── index.html
├── README.md
├── images/
│   └── pikachu-running.gif
├── scripts/
│   └── script.js
└── styles/
    ├── header.css
    └── styles.css
```

## 🎯 What I Learned

This project helped me develop several key web development skills:

### API Integration
- **Fetch API Usage**: Learned how to use `fetch()` to make HTTP requests to public APIs
- **Request Configuration**: Configured fetch options including custom headers to resolve 403 errors
- **Error Handling**: Implemented proper error handling for network requests and API responses

### JavaScript & DOM Manipulation
- **JSON Data Processing**: Extracted and processed JSON data from API responses to update HTML elements
- **Dynamic Content Creation**: Used JavaScript to dynamically create and append multiple HTML elements based on API data
- **Event Handling**: Implemented user interactions with event listeners for search functionality

### Async Programming
- **Async/Await**: Used asynchronous JavaScript for handling API calls
- **Loading States**: Implemented loading indicators to improve user experience during data fetching

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/IChaudhry892/github-user-search.git
   ```
   or
   ```bash
   git clone git@github.com:IChaudhry892/github-user-search.git
   ```

2. Navigate to the project directory:
   ```bash
   cd github-user-search
   ```

3. Open `index.html` in your browser or use a local development server.

## 🔍 How to Use

1. Enter a GitHub username in the search box
2. Click "Search" or press Enter
3. View the user's profile information and recent repositories
4. Click on repository names to visit them on GitHub
5. Use the "View Profile" button to visit the user's GitHub profile

## 🤝 Acknowledgments

This README was written with the assistance of GitHub Copilot.