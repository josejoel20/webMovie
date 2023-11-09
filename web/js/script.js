document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://swapi.dev/api/films/";
    const data = [];

    const dataPanel = document.getElementById("data-panel");
    const searchBtn = document.getElementById("submit-search");
    const searchInput = document.getElementById("search");

    const pagination = document.getElementById("pagination");
    const ITEM_PER_PAGE = 12;
    let paginationData = [];

    const listModel = document.getElementById("btn-listModel");
    const cardModel = document.getElementById("btn-cardModel");

    axios
            .get(BASE_URL)
            .then((response) => {
                data.push(...response.data.results);

                getTotalPages(data);
                getPageData(1, data);
            })
            .catch((err) => console.log(err));

// listen to data panel
    dataPanel.addEventListener("click", (event) => {
        if (event.target.matches(".btn-show-movie")) {
            showMovie(event.target.dataset.id);
        } else if (event.target.matches(".btn-add-favorite")) {
            console.log(event.target.dataset.id);
            addFavoriteItem(event.target.dataset.id);
        }
    });

    function getTotalPages(data) {
        let loader = document.getElementById("loader");
        loader.style.display = "block";

        let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
        let pageItemContent = "";

        for (let i = 0; i < totalPages; i++) {
            pageItemContent += `
            <li class="page-item">
                <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
            </li>
        `;
        }

        pagination.innerHTML = pageItemContent;
        loader.style.display = "none"; // Oculta el loader una vez que los datos se hayan cargado
    }

    // listen to search btn click event
    searchBtn.addEventListener("click", event => {
        event.preventDefault();
        console.log("click!");

        let results = [];
        const regex = new RegExp(searchInput.value, "i");

        results = data.filter(movie => movie.title.match(regex));
        console.log(results);
        // displayDataList(results)
        getTotalPages(results);
        getPageData(1, results);
    });


    function getPageData(pageNum, data) {
        paginationData = data || paginationData;
        let offset = (pageNum - 1) * ITEM_PER_PAGE;
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
        displayDataList(pageData);
    }

    function displayDataList(data) {
        let htmlContent = "";
        data.forEach(function (item, index) {
            console.log(item);
            htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="https://i.pinimg.com/originals/ea/a7/26/eaa726175de6c3300ad13d9bb7402aec.jpg" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${index + 1}">Mostrar más</button>
             </div>
          </div>
        </div>
      `;
        });
        dataPanel.innerHTML = htmlContent;
    }

    function showMovie(id) {

        const showMovieLoader = document.getElementById("show-movie-loader");
        const modalTitle = document.getElementById("show-movie-title");
        const modalImage = document.getElementById("show-movie-image");
        const modalDate = document.getElementById("show-movie-date");
        const modalEpisodio = document.getElementById("show-movie-episodio");

        const modalDirector = document.getElementById("show-movie-director");
        const modalProducer = document.getElementById("show-movie-producer");
        const modalTitlPer = document.getElementById("titlePersonaje");
        const showCharactersList = document.getElementById('show-characters-list');
        const modalDescription = document.getElementById("show-movie-description");
        showCharactersList.innerHTML = '';

        // set request url
        const url = BASE_URL + id;
        console.log(url);

        // send request to show api
        axios.get(url).then((response) => {
            const data = response.data;

            // insert data into modal ui
            modalTitle.textContent = data.title;
            modalImage.innerHTML = `<img src="https://i.pinimg.com/originals/ea/a7/26/eaa726175de6c3300ad13d9bb7402aec.jpg" class="img-fluid" alt="Responsive image">`;
            modalDate.innerHTML = `<b>Fecha de publicación:</b> ${data.release_date}`;
            modalDescription.textContent = data.opening_crawl;
            modalTitlPer.textContent = 'Personajes:';
            data.characters.forEach(characterURL => {
                axios.get(characterURL)
                        .then(responsePer => {
                            const characterName = responsePer.data.name;
                            const listItem = document.createElement('li');
                            listItem.textContent = characterName;
                            showCharactersList.appendChild(listItem);
                        })
                        .catch(error => {
                            console.error("Error fetching character data:", error);
                        });
                modalEpisodio.innerHTML = `<b>Episodio:</b> ${data.episode_id}`;
                modalDirector.innerHTML = `<b>Director:</b> ${data.director}`;
                modalProducer.innerHTML = `<b>Productor:</b> ${data.producer}`;
            });
        });
    }
})