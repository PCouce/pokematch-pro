// 1. Constantes y Variables de Estado
const TOTAL_PAIRS = 6;

let moves = 0;
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

// Array base con nombres de Pokémon para el juego de memoria
const pokemonNames = [
    "pikachu",
    "charmander",
    "charmander",
    "bulbasaur",
    "bulbasaur",
    "squirtle",
    "squirtle",
    "jigglypuff",
    "jigglypuff",
    "snorlax",
    "snorlax",
];

// 2. Selección de elementos del DOM
const movesElement = document.getElementById("moves-count");
const pairsElement = document.getElementById("pairs-count");

function updateBoardUI() {
    if (movesElement) movesElement.textContent = moves;
    if (pairsElement)
        pairsElement.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
}

updateBoardUI();

// 3. Temporizador por Consola
let secondsElapsed = 0;
let timerInterval = null;

function startConsoleTimer() {
    console.log("[PokéMatch Pro] Iniciando temporizador por consola...");
    timerInterval = setInterval(() => {
        secondsElapsed++;
        console.log(`⏱️ Tiempo transcurrido: ${secondsElapsed}s`);
    }, 1000);
}

function stopConsoleTimer() {
    clearInterval(timerInterval);
    console.log(`⏹️ Temporizador detenido a los ${secondsElapsed} segundos.`);
}

// Iniciar prueba
startConsoleTimer();

/**
 * Algoritmo de barajado Fisher-Yates
 * @param {Array} array Array de elementos a desordenar
 * @returns {Array} El mismo array mezclado aleatoriamente
 */
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generar índice aleatorio entre 0 e i
        const j = Math.floor(Math.random() * (i + 1));

        // Intercambiar elementos usando desestructuración
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Obtiene los datos detallados de un Pokémon desde la PokéAPI (incluyendo su sprite oficial)
 * @param {string|number} pokemonIdNombre o ID del Pokémon
 * @returns {Object|null} Objeto con el nombre y la URL de la imagen o null si hay error
 */
async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId.toLowerCase()}`,
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Retornamos un objeto con el nombre limpio y el sprite frontal oficial
        return {
            name: data.name,
            image: data.sprites.front_default,
        };
    } catch (error) {
        console.error(`No se pudo recuperar el Pokémon ${pokemonId}:`, error);
        return null;
    }
}

// Prueba de carga asíncrona de un Pokémon específico
async function testApiConnection() {
    console.log("[PokéMatch Pro] Consultando la PokéAPI...");
    const pokemon = await fetchPokemonData("pikachu");
    if (pokemon) {
        console.log("Pokémon obtenido con éxito:", pokemon);
    }
}

testApiConnection();

// Prueba de carga asíncrona para obtener un listado de varios pokémones para el DOM
async function testObtenerPokemons() {
    console.log("[PokéMatch Pro] Obteniendo listado de pokemones...");

    const resolvedPokemons = [];

    // Recorremos los nombres base para obtener sus sprites reales de la API
    for (const name of pokemonNames) {
        const pokemonInfo = await fetchPokemonData(name);
        if (pokemonInfo) {
            resolvedPokemons.push(pokemonInfo);
        }
    }

    console.log(
        "Pokemones con propiedades obtenidos con éxito:",
        resolvedPokemons,
    );

    const gameBoard = window.document.getElementById("game-board");
    if (!gameBoard) {
        console.warn("No se encontró el elemento #game-board en el DOM.");
        return;
    }

    // Renderizamos la lista en el DOM usando .join('') para evitar comas
    gameBoard.innerHTML = `
        <h2>Listado de Pokemones</h2>
        <ul>
            ${resolvedPokemons
                .map(
                    (pokemon) => `
                <li>
                    <strong>Pokemon name:</strong> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                </li>`,
                )
                .join("")}
        </ul>
    `;
}

testObtenerPokemons();
