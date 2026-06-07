
//Denna js-fil hanterar inloggning för anställda

const loginForm = document.getElementById("loginForm");


window.addEventListener("DOMContentLoaded", init);

function init() {

    if (loginForm) { loginForm.addEventListener("submit", login); }
}




//Logga in anställd

async function login(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedEmail = document.getElementById("email").value;
    const addedPassword = document.getElementById("password").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("errorUl");
    errorSpot.innerHTML = "";

    if (!addedEmail) {
        errors.push("Fyll i E-postadress")
    }
    if (!addedPassword) {
        errors.push("Fyll i lösenord")
    }
    errors.forEach(error => {
        const newLi = document.createElement("li");
        newLi.textContent = error;
        errorSpot.appendChild(newLi);
    });

    let user = {
        email: addedEmail,
        password: addedPassword
    }

    try {

        const response = await fetch("https://estraden-webbtj.onrender.com/employee/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        //Felmeddelande om fel epost eller lösen angetts
        if (!response.ok) {
            const errorMessage = data.message;
            const errorSpot = document.getElementById("loginError");
            errorSpot.textContent = errorMessage;
            return;

        }

        errorSpot.textContent = "";
        console.log(data);

        if (data.token) {
            localStorage.setItem("Employee-token", data.token);
            window.location.href = "admin.html";
        }

    } catch (error) {
        console.log(error);
    }

}