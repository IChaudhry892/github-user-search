// fetch("https://pokeapi.co/api/v2/pokemon/charizard")
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Could not fetch resource");
//         }
//         return response.json();
//     })
//     .then(data => console.log(data.name))
//     .catch(error => console.log(error));

// fetchData();

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", fetchData);

async function fetchData() {
    try {
        const username = document.getElementById("username").value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${username}`);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
    }
    catch(error) {
        console.error(error);
    }
}