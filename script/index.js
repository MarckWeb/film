//evento del menu desplaze
eventMenuButton()
function eventMenuButton() {
    let boton = document.getElementById("btn-menu")
    let menu = document.getElementById("menu-nav")

    boton.addEventListener("click", function () {
        menu.classList.toggle("open")
    })
}

if (document.getElementById('section-btns')) {

    let botones = document.getElementById("site-contador")
    let page = 1;

    //sector eventos botones siguiente anterior
    sectionButtonsNextAndBefore()
    function sectionButtonsNextAndBefore() {
        let next = document.getElementById("btn-siguiente");
        let anterior = document.getElementById("btn-anterior");
        next.addEventListener("click", () => {
            if (page < 1000) {
                page++;
                callApiFilm()
                botones.innerHTML = `<span>${page}<span>`
            } else {
                alert("por ahora no tenemos mas peliculas")
            }
        });

        anterior.addEventListener("click", () => {
            if (page > 1) {
                page--;
                callApiFilm()
                botones.innerHTML = `<span>${page}<span>`
            }
        })
    }

    //llamada a la api principal
    callApiFilm()
    function callApiFilm() {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=4c721357074c4e54e3f25878d8eee898&language=es-ES&page=${page}`)
            .then(resp => resp.json())
            .then(date => {
                printEtiquetsHtml(date.results)
            })
    }

    //imprimir etiquetas al escritorio
    function printEtiquetsHtml(data) {
        let listMovie = '';
        data.forEach(movies => {
            listMovie += `
        <li class="items">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${movies.poster_path}">
            <h3 class="title"> ${movies.title}</h3>
            <p> Estreno: ${movies.release_date}</p>
            <p class="description">${movies.overview}</p>
            
        </li>`
        })
        document.querySelector("#galery-movies").innerHTML = listMovie;

        //para hacer la funcion de titulos
        let itemsLi = document.querySelectorAll(".items")

        itemsLi.forEach(item => {
            item.addEventListener("click", () => {
                let image = item.querySelector('.items img').src
                let title = item.querySelector('.title').innerHTML
                let description = item.querySelector(".description").innerHTML
                let date = item.querySelector(".items p").innerHTML

                const moviesObjet = {
                    image,
                    title,
                    description,
                    date
                }
                arrayOfObjets(moviesObjet)

            })
        })
    }

    // guardar datos a localStorage
    function arrayOfObjets(moviesObjet) {
        let exist = false
        let arrayMoviesAll = [];
        if (localStorage.getItem("results")) {
            arrayMoviesAll = JSON.parse(localStorage.getItem("results"));
            for (i = 0; i < arrayMoviesAll.length; i++) {
                if (arrayMoviesAll[i].title === moviesObjet.title) {
                    exist = true
                }
            }
            if (exist == false) {
                arrayMoviesAll.push(moviesObjet)
                console.log(arrayMoviesAll)

                let stringiMovies = JSON.stringify(arrayMoviesAll)
                localStorage.setItem("results", stringiMovies)
                alert('Pelicula seleccionada a Favoritos')
            }
            else {
                alert('Esta pelicula ya tienes seleccionado como favoritos')
            }

        }
        else {
            arrayMoviesAll.push(moviesObjet)
            console.log(arrayMoviesAll)

            let stringiMovies = JSON.stringify(arrayMoviesAll)
            localStorage.setItem("results", stringiMovies)
            alert('Pelicula seleccionada a Favoritos')
        }
    }

}


if (document.querySelector(".site-favorits")) {
    //inserta valores del busacdor siguiente y anterior
    respMovies(JSON.parse(localStorage.getItem("results")))
    function respMovies(data) {

        let moviesCard = '';
        data.forEach(movies => {
            moviesCard += `
        <section class ="item-movie">
            <img width="150px" src="${movies.image}">
            <div class ="site-descript">
                <h3>${movies.title}</h3>
                <p>DESCRIPTION: ${movies.description}</p>
                <p>${movies.date}</p>
                <a target="_blank" href="https://www.youtube.com/watch?v=FSyWAxUg3Go">Ver Trailer</a>
                <button id ="btn-delete">Eliminar</button>
            </div>
        </section>`
        });
        document.querySelector(".site-favorits").innerHTML = moviesCard

        let moviesAll = document.querySelectorAll(".item-movie")

        //funcion que tiene como parametro el array obtenido del localstotage y el array con los divs de cada  movies
        deleteValuesLocalstorage(data, moviesAll)
    }

    //funcion que borra datos del local storage y los vuelve a guardar
    function deleteValuesLocalstorage(data, moviesAll) {
        moviesAll.forEach(movies => {

            let btn = movies.querySelector("#btn-delete");
            btn.addEventListener("click", () => {
                let moviesTitle = movies.querySelector(".item-movie h3").innerHTML
                //console.log(moviesTitle)
                let newData = data.filter(moviesOfTheLocal =>
                    moviesOfTheLocal.title !== moviesTitle
                )
                let saveData = JSON.stringify(newData)
                localStorage.setItem("results", saveData)

                respMovies(JSON.parse(localStorage.getItem("results")))
            })
        })
    }

}




























