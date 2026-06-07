
//Denna js-fil hanterar gästmenyn, hämtar den och skriver ut den till DOM

const menu = document.getElementById("menu");

const starters = document.getElementById("starters");
const mainMeals = document.getElementById("mainMeals");
const dessert = document.getElementById("dessert");
const beverage = document.getElementById("beverage");


window.addEventListener("DOMContentLoaded", init);

function init() {

    if (menu) { getMenu(); }
}



//Hämta menu från API

async function getMenu() {

    try {

        const fetchData = await fetch("http://localhost:3001/menu");
        const jsonData = await fetchData.json();

        renderMenu(jsonData);

    } catch (error) {
        console.log(error);
    }
}




//Skriva ut menu till DOM

function renderMenu(jsonData) {

    starters.innerHTML = "";
    mainMeals.innerHTML = "";
    dessert.innerHTML = "";
    beverage.innerHTML = "";

    jsonData.forEach(meal => {
        const mealType = meal.mealtype;
        const mealName = meal.mealname;
        const mealDescription = meal.mealdescription;
        const mealPrice = meal.mealprice;

        if (mealType === "Starter") {
            starters.innerHTML += `
        <article>
        <h3>${mealName}</h3>
        <p>${mealDescription}</p>
        <p>${mealPrice}</p>
        </article>`
        }

        if (mealType === "Main") {
            mainMeals.innerHTML += `
        <article>
        <h3>${mealName}</h3>
        <p>${mealDescription}</p>
        <p>${mealPrice}</p>
        </article>`
        }

        if (mealType === "Dessert") {
            dessert.innerHTML += `
        <article>
        <h3>${mealName}</h3>
        <p>${mealDescription}</p>
        <p>${mealPrice}</p>
        </article>`
        }

        if (mealType === "Beverage") {
            beverage.innerHTML += `
        <article>
        <h3>${mealName}</h3>
        <p>${mealDescription}</p>
        <p>${mealPrice}</p>
        </article>`
        }

    });
}