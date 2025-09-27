const TMDB_API_KEY = "4159c80cfc0220996054dedd2609affd";
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";

document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home-section');
    const moviesSection = document.getElementById('movies-section');
    const booksSection = document.getElementById('books-section');

    const showMoviesBtn = document.getElementById('show-movies-btn');
    const showBooksBtn = document.getElementById('show-books-btn');
    const backToHomeBtns = document.querySelectorAll('.back-btn');

    const moviesGrid = document.getElementById('movies-grid');
    const booksGrid = document.getElementById('books-grid');
    const cardTemplate = document.getElementById('card-template');

    moviesSection.classList.add('hidden');
    booksSection.classList.add('hidden');
    homeSection.classList.remove('hidden');

    // Corrected: The bookData array must be assigned to a variable.
    const bookData = [
        {
            type: 'book',
            name: 'Funny Story',
            genre: 'Romance, Fiction',
            year: 2024,
            description: 'A delightful new novel from Emily Henry about a woman who becomes roommates with her ex-fiancé\'s new fiancée\'s ex-boyfriend.',
            image: 'images/funny_story.jpeg'
        },
        {
            type: 'book',
            name: 'The Women',
            genre: 'Historical Fiction',
            year: 2024,
            description: 'A compelling story by Kristin Hannah that follows a young woman who joins the Army Nurse Corps and serves in the Vietnam War.',
            image: 'images/the_women.jpeg'
        },
        {
            type: 'book',
            name: 'The Ministry of Time',
            genre: 'Sci-Fi, Romance',
            year: 2024,
            description: 'A hilarious and heartfelt novel about a civil servant who is tasked with welcoming "expats" from different historical periods to London.',
            image: 'images/ministry_of_time.jpeg'
        },
        {
            type: 'book',
            name: 'A Fate Inked in Blood',
            genre: 'Fantasy, Romance',
            year: 2024,
            description: 'A new fantasy novel inspired by Norse mythology about a shield-maiden who must prove her worth and save her kingdom from an ancient threat.',
            image: 'images/a_fate_inked_in_blood.jpeg'
        },
        {
            type: 'book',
            name: 'James',
            genre: 'Fiction, Classic Literature',
            year: 2024,
            description: 'Percival Everett\'s brilliant retelling of "The Adventures of Huckleberry Finn" from the perspective of the enslaved man, Jim.',
            image: 'images/james.jpg'
        },
        {
            type: 'book',
            name: 'Fourth Wing',
            genre: 'Fantasy, Romance',
            year: 2023,
            description: 'A brutal and dangerous war college setting where aspiring dragon riders compete for a place, with life-threatening consequences for failure.',
            image: 'images/fourth_wing.jpeg'
        },
        {
            type: 'book',
            name: 'The Housemaid',
            genre: 'Thriller',
            year: 2023,
            description: 'A psychological thriller about a housemaid who gets hired by a wealthy couple and uncovers dark secrets about the family.',
            image: 'images/the_housemaid.jpeg'
        },
        {
            type: 'book',
            name: 'Yellowface',
            genre: 'Literary Fiction, Satire',
            year: 2023,
            description: 'A satirical novel by R. F. Kuang about a white writer who steals and publishes a deceased Asian-American author\'s manuscript.',
            image: 'images/yellowface.jpeg'
        },
        {
            type: 'book',
            name: 'Happy Place',
            genre: 'Romance',
            year: 2023,
            description: 'A couple pretends to still be together for a yearly week-long vacation with their friends, only to face the reality of their breakup.',
            image: 'images/happy_place.jpeg'
        },
        {
            type: 'book',
            name: 'The Covenant of Water',
            genre: 'Historical Fiction',
            year: 2023,
            description: 'Spanning over a century, this novel follows a family in Kerala, India, and their persistent struggle with a peculiar family curse.',
            image: 'images/covenant_of_water.jpeg'
        }
    ];

    // Function to fetch and display movies from TMDB
    async function fetchMoviesAndDisplay() {
        const url = `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const movies = data.results.slice(0, 10); // Get top 10 trending movies

            movies.forEach(movie => {
                createCard({
                    id: movie.id, // Use a unique ID for local storage
                    type: 'movie',
                    name: movie.title,
                    genre: movie.genre_ids.join(', '), // TMDB uses genre IDs
                    year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
                    description: movie.overview,
                    image: `${TMDB_IMG_URL}${movie.poster_path}`
                }, moviesGrid);
            });

        } catch (error) {
            console.error("Could not fetch movies:", error);
            // Display an error message to the user
            moviesGrid.innerHTML = `<p class="error-message">Failed to load movies. Please check your API key and internet connection.</p>`;
        }
    }

    // Function to display local book data
    function displayBooks() {
        bookData.forEach(book => {
            createCard(book, booksGrid);
        });
    }

    // Main function to create a card and handle its interactivity
    function createCard(item, gridContainer) {
        const cardClone = cardTemplate.content.cloneNode(true);
        const card = cardClone.querySelector('.card');

        // Populate card details
        card.querySelector('.card-image').src = item.image;
        card.querySelector('.card-image').alt = `${item.name} cover`;
        card.querySelector('.card-title').textContent = item.name;
        card.querySelector('.card-genre-year').textContent = `${item.genre} | ${item.year}`;
        card.querySelector('.card-description').textContent = item.description;

        const starsContainer = card.querySelector('.stars');
        const submitButton = card.querySelector('.submit-review');
        const reviewBox = card.querySelector('.review-box');

        // Use a unique key for each item in local storage
        const localStorageKey = `${item.type}-${item.id || item.name}`;

        // Check for existing review in local storage on page load
        const savedReview = JSON.parse(localStorage.getItem(localStorageKey));
        if (savedReview) {
            starsContainer.dataset.rating = savedReview.rating;
            reviewBox.value = savedReview.review;
            updateStarVisuals(starsContainer, savedReview.rating);
        }

        // Star rating and review submission logic
        starsContainer.addEventListener('mouseover', (e) => {
            const value = e.target.dataset.value;
            if (value) {
                updateStarVisuals(starsContainer, value);
            }
        });

        starsContainer.addEventListener('mouseout', () => {
            const currentRating = starsContainer.dataset.rating;
            updateStarVisuals(starsContainer, currentRating);
        });

        starsContainer.addEventListener('click', (e) => {
            const value = e.target.dataset.value;
            if (value) {
                starsContainer.dataset.rating = value;
                updateStarVisuals(starsContainer, value);
            }
        });

        submitButton.addEventListener('click', () => {
            const reviewText = reviewBox.value.trim();
            const rating = starsContainer.dataset.rating;

            if (reviewText && rating > 0) {
                // Save review to local storage
                const reviewObject = {
                    rating: rating,
                    review: reviewText,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(localStorageKey, JSON.stringify(reviewObject));

                alert(`Review for "${item.name}" submitted successfully! It has been saved to your browser's local storage.`);

            } else {
                alert('Please provide a star rating and a review before submitting.');
            }
        });

        gridContainer.appendChild(cardClone);
    }

    // Helper function to update star visuals
    function updateStarVisuals(container, rating) {
        container.querySelectorAll('.fa-star').forEach(star => {
            star.classList.remove('active');
            if (star.dataset.value <= rating) {
                star.classList.add('active');
            }
        });
    }

    // Handle button clicks for navigation
    showMoviesBtn.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        moviesSection.classList.remove('hidden');
        moviesGrid.innerHTML = ''; // Clear previous content
        fetchMoviesAndDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    showBooksBtn.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        booksSection.classList.remove('hidden');
        booksGrid.innerHTML = ''; // Clear previous content
        displayBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backToHomeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            homeSection.classList.remove('hidden');
            moviesSection.classList.add('hidden');
            booksSection.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});