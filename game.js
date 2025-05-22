var isGame = false;
var chosenDifficulty = undefined;
const cardsContainer = document.getElementById("cards-grid");

let timerInterval = null;
let matchedPairs = 0;
let totalPairs = 0;
let powerUpInterval = null;
let pairsRemaining = 0;

const cardTemplate = (url, counter) => {
	const cards = document.getElementById("cards-grid");

	const card = document.createElement("div");
	card.classList.add("card");
	card.id = `card${counter}`

	const pokemonImg = document.createElement("img");
	pokemonImg.src = url;
	pokemonImg.classList.add("card-front-face");

	const backcardImg = document.createElement("img");
	backcardImg.src = "back.webp";
	backcardImg.classList.add("card-back-face");

	card.appendChild(pokemonImg);
	card.appendChild(backcardImg);
	cards.appendChild(card);

	card.addEventListener("click", function () {
		clickCounter++;
		document.getElementById("cardClicker").textContent = `${clickCounter}`;
	});
	card.addEventListener("click", onCardClick)
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const getRandomPokemonId = (uniquePokemon, count) => {
	while (uniquePokemon.length < count) {
		let id = Math.floor(Math.random() * 1025) + 1;
		if (!uniquePokemon.includes(id)) {
			uniquePokemon.push(id);
		}
	}
	console.log(uniquePokemon)
	return uniquePokemon;
}

const generatePokemon = (pairMatch, basis) => {
	const uniqueIds = getRandomPokemonId([], pairMatch);
	const allIds = [...uniqueIds, ...uniqueIds];
	shuffle(allIds);

	var pokemonCounter = 0;
	let cardsCreated = 0;
	allIds.forEach(pokemonId => {
		axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
			.then(response => {
				const pokemonData = response.data;
				pokemonCounter++;
				cardTemplate(`https://img.pokemondb.net/sprites/home/normal/${pokemonData.name}.png`, pokemonCounter);
				cardsCreated++;
				// When all cards are created, set flex-basis
				if (cardsCreated === allIds.length) {
					setCardFlexBasis(basis);
				}
			})
			.catch(error => {
				console.error('Error fetching Pokemon:', error);
			});
	});
}

function setCardFlexBasis(basis) {
	const cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		card.style.flexBasis = basis;
	});
}

const difficultyButtons = () => {
	const easyBtn = document.getElementById("easyButton");
	const normalBtn = document.getElementById("normalButton");
	const hardBtn = document.getElementById("hardButton");

	const allBtns = [easyBtn, normalBtn, hardBtn];

	allBtns.forEach((btn, idx) => {
		btn.addEventListener("click", () => {
			// Remove the class from all buttons
			allBtns.forEach(b => b.classList.remove("selected-difficulty"));
			// Add the class to the clicked button
			btn.classList.add("selected-difficulty");
			// Set chosenDifficulty
			chosenDifficulty = idx + 1;
			console.log(`select ${btn.textContent.toLowerCase()}`);
			console.log(chosenDifficulty)
		});
	});
}


const showGame = () => {
	const gameDisplay = document.getElementById("cards-grid");


}


const resetButton = () => {
	const resetBtn = document.getElementById("resetButton");
	const easyBtn = document.getElementById("easyButton");
	const normalBtn = document.getElementById("normalButton");
	const hardBtn = document.getElementById("hardButton");
	const startBtn = document.getElementById("startButton");
	const bottomBtns = document.getElementById("bottom-buttons")
	const cardsGrid = document.getElementById("cards-grid")

	resetBtn.addEventListener("click", () => {
		clickCounter = 0;
		totalPairs = 0
		matchedPairs = 0
		document.getElementById("totalPairs").textContent = totalPairs
		document.getElementById("totalMatches").textContent = totalPairs
		document.getElementById("cardClicker").textContent = clickCounter;
		easyBtn.classList.remove("selected-difficulty");
		normalBtn.classList.remove("selected-difficulty");
		hardBtn.classList.remove("selected-difficulty");
		startBtn.style.display = "inline";
		cardsGrid.style.display = "none"
		bottomBtns.style.display = "none"
		cardsGrid.innerHTML = "";
		// Stop and reset the timer
		clearInterval(timerInterval);
		stopPowerUp();
		document.getElementById("gameTimer").textContent = 0;
		document.getElementById("gameTimerElapsed").textContent = 0;
	})
}

const startButton = () => {
	const startBtn = document.getElementById("startButton");

	startBtn.addEventListener("click", () => {
		if (!chosenDifficulty)
			return;

		const cardsGrid = document.getElementById("cards-grid");
		const bottomBtns = document.getElementById("bottom-buttons");

		cardsGrid.style.display = "flex";
		bottomBtns.style.display = "flex";

		startBtn.style.display = "none"

		switch (chosenDifficulty) {
			case 1:
				easyMode();
				break;
			case 2:
				normalMode();
				break;
			case 3:
				hardMode();
				break;
		}
	});
}

function startTimer(limit) {
	clearInterval(timerInterval);
	let timeLeft = limit;
	document.getElementById("gameTimer").textContent = timeLeft;
	document.getElementById("gameTimerElapsed").textContent = 0;
	let elapsed = 0;

	timerInterval = setInterval(() => {
		elapsed++;
		document.getElementById("gameTimer").textContent = timeLeft;
		document.getElementById("gameTimerElapsed").textContent = elapsed;
		if (timeLeft <= 0) {
			clearInterval(timerInterval);
			endGame(false);
		}
	}, 1000);
}

function endGame(win) {
	clearInterval(timerInterval);
	const cardsGrid = document.getElementById("cards-grid");
	const gameButtons = document.getElementById("game-buttons");
	const bottomBtns = document.getElementById("bottom-buttons");

	if (win) {
		// Freeze the program and show alert
		setTimeout(() => {
			alert("You win!");
		}, 100);
		stopPowerUp();
	} else {
		cardsGrid.innerHTML = '<div style="width:100%;text-align:center;font-size:2em;">Try again.</div>';
		if (gameButtons) gameButtons.innerHTML = '<div style="width:100%;text-align:center;font-size:2em;">Timer\'s up.</div>';
		if (bottomBtns) bottomBtns.innerHTML = '';
		stopPowerUp();
	}
}

// function onCardClick(e) {
// 	// ... your existing matching logic ...
// 	// After a successful match:
// 	matchedPairs++;
// 	if (matchedPairs === totalPairs) {
// 		endGame(true);
// 	}
// }

const displayPairsRemaining = (pairs) => {
	const pairsLeft = document.getElementById("pairsLeft");
	pairsLeft.textContent = pairs;
}

const easyMode = () => {
	cardsContainer.style.width = "600px";
	cardsContainer.style.height = "400px";
	totalPairs = 3;
	matchedPairs = 0;
	pairsRemaining = totalPairs;
	displayTotalPairs(totalPairs);
	displayPairsRemaining(pairsRemaining);
	generatePokemon(3, "33.3%");
	startTimer(100); // 30 seconds for easy mode
	startPowerUp();
}

const normalMode = () => {
	cardsContainer.style.width = "800px";
	cardsContainer.style.height = "600px";
	totalPairs = 6;
	matchedPairs = 0;
	pairsRemaining = totalPairs;
	displayTotalPairs(totalPairs);
	displayPairsRemaining(pairsRemaining);
	generatePokemon(6, "25%");
	startTimer(200); // 60 seconds for normal mode
	startPowerUp();
}

const hardMode = () => {
	cardsContainer.style.width = "1200px";
	cardsContainer.style.height = "800px";
	totalPairs = 12;
	matchedPairs = 0;
	pairsRemaining = totalPairs;
	displayTotalPairs(totalPairs);
	displayPairsRemaining(pairsRemaining);
	generatePokemon(12, "16.66%");
	startTimer(300); // 120 seconds for hard mode
	startPowerUp();
}

const displayTotalPairs = (cardPairs) => {
	const totalPairs = document.getElementById("totalPairs");
	totalPairs.textContent = cardPairs
}


function startPowerUp() {
	clearInterval(powerUpInterval);
	powerUpInterval = setInterval(() => {
		revealAllCards();
		setTimeout(hideAllCards, 3000); // Hide after 5 seconds
	}, 20000); // Every 20 seconds
}

function revealAllCards() {
	document.querySelectorAll('.card').forEach(card => {
		card.classList.add('flip');
	});
}

function hideAllCards() {
	document.querySelectorAll('.card').forEach(card => {
		card.classList.remove('flip');
	});
}

function stopPowerUp() {
	clearInterval(powerUpInterval);
	hideAllCards();
}

startButton();
resetButton();
difficultyButtons();