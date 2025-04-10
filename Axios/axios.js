import axios from 'axios';

const breedSelect = document.getElementById('breedSelect');
const carousel = document.querySelector('.carousel');
const infoDump = document.getElementById('infoDump');


const API_KEY = 'live_RxmagQydG2YyXUIUONqbOq6n9i5R5U3eg0QfUTtKWEAJmKULHU3ksbJaZSz5BFfd';// Replace with your actual API key

// Configure Axios defaults
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
    headers: {
        'x-api-key': API_KEY
    }
});

// Add request interceptor
api.interceptors.request.use(config => {
    console.log('Request started at:', new Date().toISOString());
    config.metadata = { startTime: new Date() };
    return config;
}, error => Promise.reject(error));

// Add response interceptor
api.interceptors.response.use(response => {
    const endTime = new Date();
    const startTime = response.config.metadata.startTime;
    const duration = endTime - startTime;
    console.log(`Request completed in ${duration}ms`);
    return response;
}, error => Promise.reject(error));

// Initial load function
async function initialLoad() {
    try {
        // Fetch breeds
        const response = await api.get('breeds');
        const breeds = response.data;

        // Populate breed select options
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });

        // Trigger initial carousel load with first breed
        handleBreedSelection({ target: { value: breeds[0].id } });
    } catch (error) {
        console.error('Error loading breeds:', error);
    }
}

// Breed selection handler
async function handleBreedSelection(event) {
    try {
        const breedId = event.target.value;
        
        // Fetch breed images and info
        const response = await api.get(`images/search?breed_ids=${breedId}&limit=5`);
        const breedData = response.data;

        // Clear existing content
        carousel.innerHTML = '';
        infoDump.innerHTML = '';

        // Populate carousel
        breedData.forEach(item => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = 'Cat image';
            carouselItem.appendChild(img);
            carousel.appendChild(carouselItem);
        });

        // Populate info section
        if (breedData.length > 0) {
            const breed = breedData[0].breeds[0];
            infoDump.innerHTML = `
                <h2>${breed.name}</h2>
                <p><strong>Origin:</strong> ${breed.origin}</p>
                <p><strong>Temperament:</strong> ${breed.temperament}</p>
                <p><strong>Description:</strong> ${breed.description}</p>
            `;
        }

    } catch (error) {
        console.error('Error loading breed data:', error);
    }
}

// Event listener
breedSelect.addEventListener('change', handleBreedSelection);

// Initial execution
initialLoad();