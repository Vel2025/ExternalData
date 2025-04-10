import * as Carousel from "./carousel.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_RxmagQydG2YyXUIUONqbOq6n9i5R5U3eg0QfUTtKWEAJmKULHU3ksbJaZSz5BFfd";
  axios.defaults.headers.common.authorization =`Bearer ${API_KEY}`;
  axios.defaults.baseURL = "https://api.thecatapi.com";

axios.interceptors.request.use((request)=>{
  console.log('Request sent!');
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  return request;
})
axios.interceptors.response.use((response)=>{
  response.metadata = response.metadata || {};
  response.metadata.endTime = new Date().getTime();
  console.log('Response received!!');
  response.metadata.timeDIff = response.metadata.endTime - response.config.metadata.startTime;
  console.log(`Response time took: ${response.metadata.timeDIff}ms`);
  return response;
})

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoad() {
  let breedID;
  const response = await axios("/v1/breeds");
  console.log(response.data);
//   const jsonData = await response.json();
  for (let breed of response.data) {
    breedID = breed["id"];
    let breedName = breed["name"];
    let optionEl = document.createElement("option");
    optionEl.value = breedID;
    optionEl.textContent = breedName;
    // console.log(breedID, breedName);
    breedSelect.appendChild(optionEl);
  }
  getBreedData(response.data[0].id);
}



/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener("change", handleBreedSelect);
function handleBreedSelect(e) {
  Carousel.clear();
  infoDump.innerHTML ="";
  let selectedBreedID = e.target.value;
  // console.log(selectedBreedID);
  getBreedData(selectedBreedID);
}
async function getBreedData(breedID) {
  const imgResponse = await axios(
    `/v1/images/search?breed_ids=${breedID}&limit=10`
  );
//   const imgData = await imgResponse.json();
  console.log(imgResponse.data);
  const breedResponse = await axios(
    `/v1/breeds/${breedID}`
  );
//   const breedDetails = await breedResponse.json();
  console.log(breedResponse.data);
  const breedDetails = breedResponse.data;
  imgResponse.data.forEach((element) => {
    const CarouselItem = Carousel.createCarouselItem(
      element.url,
      breedDetails.name,
      element.id
    );
    CarouselItem.classList.add("carousel-item");
    Carousel.appendCarousel(CarouselItem);
    Carousel.start();
   
  });
  getBreedinfo(breedDetails);
}
  function getBreedinfo(breedDetails){
  const infoDumpEl = document.createElement('div');
    infoDumpEl.innerHTML =   `<h2> ${breedDetails.name}</h2>
    <p>Origin: ${breedDetails.origin}</p>
      <p>Description: ${breedDetails.description}</p>
          <p>Temperament:${breedDetails.temperament}</p>
             <p>Life span:${breedDetails.life_span}</p>`
    infoDump.appendChild(infoDumpEl);;
  }

initialLoad();