const API_KEY = '5b85cbd7ae6aa997ee33c0e67960e112';
const URL_IMAGEN = 'https://image.tmdb.org/t/p/w500';

const selectGenero = document.querySelector('#select-genero');
const modal = document.querySelector('#modal-pelicula');
const btnCerrar = document.querySelector('#btn-cerrar');
const videoContainer = document.querySelector('.video-container');
const iframeTrailer = document.querySelector('#peli-trailer');
const infoModal = document.querySelector('.info-modal');
const imgPoster = document.querySelector('#peli-poster');


document.querySelector('#btn-girar').addEventListener('click', async () => {
    const pagina = Math.floor(Math.random() * 15) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-MX&with_genres=${selectGenero.value}&page=${pagina}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const peliculas = datos.results;

        if (!peliculas || peliculas.length === 0) return;

        const peli = peliculas[Math.floor(Math.random() * peliculas.length)];

        let resTrailer = await fetch(`https://api.themoviedb.org/3/movie/${peli.id}/videos?api_key=${API_KEY}&language=es-MX`);
        let datosTrailer = await resTrailer.json();
        let trailer = datosTrailer.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (!trailer) {
            resTrailer = await fetch(`https://api.themoviedb.org/3/movie/${peli.id}/videos?api_key=${API_KEY}&language=en-US`);
            datosTrailer = await resTrailer.json();
            trailer = datosTrailer.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }

        document.querySelector('#peli-titulo').textContent = peli.title;
        document.querySelector('#peli-rating').textContent = `⭐ ${peli.vote_average.toFixed(1)} / 10`;
        document.querySelector('#peli-overview').textContent = peli.overview || 'Sin descripción disponible.';

        if (trailer) {
            iframeTrailer.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            videoContainer.style.display = 'block';
            imgPoster.style.display = 'none';
            infoModal.classList.remove('con-poster');
        } else {
            iframeTrailer.src = '';
            videoContainer.style.display = 'none';
            imgPoster.src = `${URL_IMAGEN}${peli.poster_path}`;
            imgPoster.style.display = 'block';
            infoModal.classList.add('con-poster');
        }

        modal.showModal();

    } catch (error) {
        console.error("Error al obtener la película:", error);
    }
});

btnCerrar.addEventListener('click', () => {
    iframeTrailer.src = '';
    modal.close();
});