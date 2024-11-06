// Helper function to get favorites from localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Helper function to save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Add a function to handle adding/removing favorites
function toggleFavorite(country, action) {
    const favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.cca3 === country.cca3);

    if (action === 'add' && index === -1) {
        if (favorites.length < 5) {
            favorites.push(country);
        } else {
            alert("You can only have up to 5 favorites.");
            return;
        }
    } else if (action === 'remove' && index !== -1) {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    renderCountryList();
}

// Variables to manage pagination
let currentPage = 1;
const countriesPerPage = 12;
let allCountries = [];  




// Render country list based on search input and pagination
function renderCountryList(searchQuery = '') {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';
    const favorites = getFavorites();

    const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(searchQuery.toLowerCase()));
    const countriesToDisplay = filteredCountries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage);

    countriesToDisplay.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
            <p>${country.name.common}</p>
            <button class="favorite-btn">
                ${favorites.some(fav => fav.cca3 === country.cca3) ? '❤️' : '🤍'}
            </button>
        `;
        const favoriteButton = countryCard.querySelector('.favorite-btn');
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = favorites.some(fav => fav.cca3 === country.cca3) ? 'remove' : 'add';
            toggleFavorite(country, action);
        });
        countryCard.addEventListener('click', () => showCountryDetailsPage(country));
        countryList.appendChild(countryCard);
    });
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (currentPage * countriesPerPage < filteredCountries.length) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}



// Function to load more countries when the "Show More" button is clicked
function loadMoreCountries() {
    currentPage++;
    renderCountryList();
}

// Function to show country details page
function showCountryDetailsPage(country) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('countryDetailsPage').style.display = 'block';

    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.cca3 === country.cca3);

    const countryDetails = document.getElementById('countryDetails');
    countryDetails.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
        <p><strong>Top Level Domain:</strong> ${country.tld ? country.tld.join(', ') : 'N/A'}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} sq km</p>
        <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
        <!-- Action buttons placed below Languages -->
        <div class="details-actions">
        <button id="favoriteButton" class="action-btn">${isFavorite ? '❤️' : '🤍 '}</button>
        </div>
        `;
        document.getElementById('backButton').addEventListener('click', showMainPage);
        const favoriteButton = document.getElementById('favoriteButton');
        favoriteButton.addEventListener('click', () => {
            const action = isFavorite ? 'remove' : 'add';
            toggleFavorite(country, action);
            showCountryDetailsPage(country); 
        });
    }
    
 // Add event listener for the "Back" button
    document.getElementById('backButton').addEventListener('click', showMainPage);

// Function to show the main page when the "Back" button is clicked
function showMainPage() {
    document.getElementById('countryDetailsPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
}

// Function to handle the search button click and Enter key
function handleSearch() {
    const searchQuery = document.getElementById('search').value;
    renderCountryList(searchQuery);
}

// Initialize the page by rendering country list
document.addEventListener("DOMContentLoaded", () => {
    // Fetch the countries and initialize
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            allCountries = data;
            renderCountryList();
        })
        .catch(error => console.error('Error fetching countries:', error));
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    document.getElementById('loadMoreButton').addEventListener('click', loadMoreCountries);
});

// Render the favorites box on the right side
function renderFavoritesBox() {
    const favorites = getFavorites();
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = ''; 
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites yet.</p>';
    } else {
        favorites.forEach(country => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="30">
                <span>${country.name.common}</span>
            `;
            listItem.style.cursor = 'pointer'; 
            listItem.addEventListener('click', () => showCountryDetailsPage(country));

            favoritesList.appendChild(listItem);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    renderFavoritesBox();
});


// Update the toggleFavorite function to call renderFavoritesBox
function toggleFavorite(country, action) {
    const favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.cca3 === country.cca3);

    if (action === 'add' && index === -1) {
        if (favorites.length < 5) {
            favorites.push(country);
        } else {
            alert("You can only have up to 5 favorites.");
            return;
        }
    } else if (action === 'remove' && index !== -1) {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    renderCountryList(); 
    renderFavoritesBox();
}
document.addEventListener("DOMContentLoaded", () => {
    renderFavoritesBox();
});
