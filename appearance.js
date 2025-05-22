const lightmodeBtn = document.getElementById("lightmodeButton");
const darkmodeBtn = document.getElementById("darkmodeButton");

const setH1Color = (color) => {
    document.querySelectorAll('h1').forEach(h1 => {
        h1.style.color = color;
    });
}

const darkmodeButton = () => {

    darkmodeBtn.addEventListener("click", () => {
        const background = document.getElementById("background");
        const cardsGrid = document.getElementById("cards-grid")
        background.classList.add("dark-mode");
        background.classList.remove("light-mode");
        cardsGrid.style.border = "1px solid white";
        darkmodeBtn.style.border = "2px solid white";
        lightmodeBtn.style.border = "2px solid white";
        localStorage.setItem("darkMode", "enabled");
        setH1Color("white");
    })
}

const lightmodeButton = () => {

    lightmodeBtn.addEventListener("click", () => {
        const background = document.getElementById("background");
        const cardsGrid = document.getElementById("cards-grid")
        background.classList.remove("dark-mode");
        background.classList.add("light-mode");
        cardsGrid.style.border = "1px solid black";
        lightmodeBtn.style.border = "2px solid #000000";
        darkmodeBtn.style.border = "2px solid #000000";
        localStorage.setItem("darkMode", "disabled");
        setH1Color("black");
    })
}

const checkTheme = () => {
    const background = document.getElementById("background");
    const savedTheme = localStorage.getItem("darkMode");
    const cardsGrid = document.getElementById("cards-grid")

    if (savedTheme === "enabled") {
        background.classList.add("dark-mode");
        background.classList.remove("light-mode");
        cardsGrid.style.border = "1px solid white";
        darkmodeBtn.style.border = "2px solid white";
        lightmodeBtn.style.border = "2px solid white";
        setH1Color("white");
    } else {
        background.classList.remove("dark-mode");
        background.classList.add("light-mode");
        cardsGrid.style.border = "1px solid black";
        lightmodeBtn.style.border = "2px solid #000000";
        darkmodeBtn.style.border = "2px solid #000000";
        setH1Color("black");
    }
}

checkTheme();
darkmodeButton();
lightmodeButton();