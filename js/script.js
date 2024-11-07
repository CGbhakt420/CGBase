const global = {
  currentPage: window.location.pathname,
};

async function displayPopularGames() {
  // Use `await` to wait for the data before logging
  const { results } = await FetchApiData("games?ordering=-added");
  results.forEach((game) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
                <a href="movie-details.html?id=${game.id}">
                    <img
                        src="${
                          game.background_image ||
                          "images/no_selection_699e871f-fd70-4a0f-afd5-2d2c980f24ed.webp"
                        }"
                        class="card-img-top"
                        alt="${game.name}"
                    />
                </a>
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">
                        <small class="text-muted">Rating: ${
                          game.rating || "N/A"
                        }</small>
                    </p>
                </div>
            `;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

function showspinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hidespinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//Display Game Details

async function displayGameDetails() {
  const gameID = window.location.search.split("=")[1];
  //console.log(gameID);
  const game = await FetchApiData(`games/${gameID}?`);

  //overlay for bg image
  displayBackgroundImg(game.background_image_additional);


  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
          <div>
            <img
                        src="${
                          game.background_image ||
                          "images/no_selection_699e871f-fd70-4a0f-afd5-2d2c980f24ed.webp"
                        }"
                        class="card-img-top"
                        alt="${game.name}"
                    />
          </div>
          <div>
            <h2>${game.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${game.rating ? game.rating : "N/A"} / 5
            </p>
            <p class="text-muted">Release Date: ${game.released}</p>
            <p>
              ${game.description}
            </p>
            <h5>More Information</h5>
            <ul class="list-group">
              <li>Playtime: ${game.playtime} hours</li>
              <li>Metacritic Score: ${game.metacritic}</li>
              <li>Developers: ${
                game.developers && game.developers.length > 0
                  ? game.developers
                      .map((developer) => `${developer.name}`)
                      .join(" ")
                  : "No developer information available"
              }</li>
              <li>Platforms: ${
                game.platforms
                  ? game.platforms
                      .map((platform) => `${platform.platform.name}`)
                      .join(" ")
                  : "No platforms available"
              }
        </li>
             
              
            </ul>
            <a href="${
              game.metacritic_url
            }" target="_blank" class="btn">Metacritic Link</a>
          </div>
        </div>
        <div class="details-bottom">
          
        </div>
    `;
  document.querySelector("#movie-details").appendChild(div);
}



function displayBackgroundImg(bgPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(${bgPath})`;
    overlayDiv.style.backgroundSize = 'cover'; // Ensures the image covers the entire screen
    overlayDiv.style.backgroundPosition = 'center'; // Centers the image within the div
    overlayDiv.style.backgroundRepeat = 'no-repeat'; // Prevents image repetition
    overlayDiv.style.height = '100vh'; // Full viewport height
    overlayDiv.style.width = '100vw'; // Full viewport width
    overlayDiv.style.position = 'fixed'; // Ensures the background stays in place when scrolling
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1'; // Keeps the background behind other elements
    overlayDiv.style.opacity = '0.4'; // Optional: to dim the background image if needed

    // Append the overlayDiv to the body or a specific element with the id "movie-details"
    document.body.appendChild(overlayDiv); // Using body ensures it covers the full viewport, even if the #movie-details element is smaller
}


//Display slider 
async function displaySlider(){
    const currentYear = new Date().getFullYear();
    const dateRange = `${currentYear}-01-01,${currentYear}-12-31`

    const {results} = await FetchApiData(`games?ordering=-rating&dates=${dateRange}`);
    
    results.forEach((game)=>{
        const div = document.createElement('div');
        div.classList.add('swiper-slide');

        div.innerHTML = `
        <a href="movie-details.html?id=${game.id}">
              <img src="${
                          game.background_image ||
                          "images/no_selection_699e871f-fd70-4a0f-afd5-2d2c980f24ed.webp"
                        }" />
            </a>
            <h4 class="swiper-rating">
              ${game.name} <i class="fas fa-star text-secondary"></i> ${game.rating}
            </h4>
        `;

        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    })
    
}

function initSwiper(){
    const swiper = new Swiper('.swiper',{
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay:4000,
            disableOnInteraction: false
        },
        breakpoints:{
            500:{
                slidesPerView: 2
            },
            700:{
                slidesPerView: 3
            },
            1200:{
                slidesPerView: 4
            },
        }
    })
}




// Fetch Data
async function FetchApiData(endpoint) {
  const API_KEY = "fa4e01657e0c492a9f8221ff86c3a63f";
  const API_URL = "https://api.rawg.io/api";

  showspinner();
  // Remove any extra slash between `API_URL` and `endpoint`
  const response = await fetch(`${API_URL}/${endpoint}&key=${API_KEY}`);

  // Check if the response is okay
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  hidespinner();
  return data;
}

// INIT APP
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularGames();
      displaySlider();
      console.log("Home");
      break;
    case "/movie-details.html":
      displayGameDetails();
      console.log("Movie Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
