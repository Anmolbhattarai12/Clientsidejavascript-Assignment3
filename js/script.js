console.log("Script is connected");

// Assignment 3 - Third-Party APIs
// Movie Poster Explorer using The Movie Database API

// Dynamically add student name and ID using JavaScript
var studentInfo = document.getElementById("student-info");
studentInfo.textContent = "Student Name: Anmol Bhattarai | Student ID: 200573451";

// TMDB API Key
// Replace PASTE_YOUR_API_KEY_HERE with your real TMDB API Key v3 auth
var apiKey = "7bf9acc13aee5e6a35ff23d16e2d29e3";

// Select HTML elements
var movieForm = document.getElementById("movie-form");
var movieInput = document.getElementById("movie-input");
var popularButton = document.getElementById("popular-button");
var resultsDiv = document.getElementById("results");

// Search movie when the form is submitted
movieForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var movieName = movieInput.value.trim();

    if (movieName === "") {
        resultsDiv.innerHTML = "<p>Please enter a movie name.</p>";
        return;
    }

    searchMovies(movieName);
});

// Show popular movies when the button is clicked
popularButton.addEventListener("click", function () {
    showPopularMovies();
});

// API call 1: Search movies by name
function searchMovies(movieName) {
    resultsDiv.innerHTML = "<p>Loading movie results...</p>";

    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + encodeURIComponent(movieName);

    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("API request failed.");
            }

            return response.json();
        })
        .then(function (data) {
            displayMovies(data.results);
        })
        .catch(function (error) {
            resultsDiv.innerHTML = "<p>Something went wrong. Please check your API key and try again.</p>";
            console.log(error);
        });
}

// API call 2: Show popular movies
function showPopularMovies() {
    resultsDiv.innerHTML = "<p>Loading popular movies...</p>";

    var apiUrl = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("API request failed.");
            }

            return response.json();
        })
        .then(function (data) {
            displayMovies(data.results);
        })
        .catch(function (error) {
            resultsDiv.innerHTML = "<p>Something went wrong. Please check your API key and try again.</p>";
            console.log(error);
        });
}

// Display movie cards on the page
function displayMovies(movies) {
    resultsDiv.innerHTML = "";

    if (movies.length === 0) {
        resultsDiv.innerHTML = "<p>No movies found. Try another search.</p>";
        return;
    }

    // Display first 8 movie results
    for (var i = 0; i < movies.length && i < 8; i++) {
        var movie = movies[i];

        var posterHtml = "";

        if (movie.poster_path) {
            var posterUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
            posterHtml = '<img src="' + posterUrl + '" alt="' + movie.title + ' poster">';
        } else {
            posterHtml = '<div class="no-poster">No Poster Available</div>';
        }

        var movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML =
            posterHtml +
            '<div class="movie-content">' +
            '<h3>' + movie.title + '</h3>' +
            '<span class="rating">Rating: ' + movie.vote_average + '/10</span>' +
            '<p><strong>Release Date:</strong> ' + getMovieDate(movie.release_date) + '</p>' +
            '<p>' + getShortOverview(movie.overview) + '</p>' +
            '</div>';

        resultsDiv.appendChild(movieCard);
    }
}

// Handle missing release dates
function getMovieDate(date) {
    if (date) {
        return date;
    } else {
        return "Not available";
    }
}

// Shorten long movie descriptions
function getShortOverview(overview) {
    if (!overview) {
        return "No overview available.";
    }

    if (overview.length > 150) {
        return overview.slice(0, 150) + "...";
    } else {
        return overview;
    }
}

// Load popular movies automatically when the page opens
showPopularMovies();