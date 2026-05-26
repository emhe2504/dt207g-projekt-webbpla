//För gästers meny:
const menu = document.getElementById("menu");
const starters = document.getElementById("starters");
const mainMeals = document.getElementById("mainMeals");
const dessert = document.getElementById("dessert");
const beverage = document.getElementById("beverage");

//För gästers bokningar:
const reservationForm = document.getElementById("reservationForm");
const bookingConfirmation = document.getElementById("confirmation");
const getBookingForm = document.getElementById("getBookingForm");
const resultSpot = document.getElementById("bookingResult");

//För anställlda
const loginForm = document.getElementById("loginForm");

const adminReservationForm = document.getElementById("adminReservationForm");
const adminBookingConfirmation = document.getElementById("adminConfirmation");
const getBookingAdmin = document.getElementById("getBookingAdmin");
const adminResultDiv = document.getElementById("adminResultDiv");
const adminResultSpot = document.getElementById("adminBookingResult");


window.addEventListener("DOMContentLoaded", init);

function init() {

    //För gästers meny:
    if (menu) { getMenu(); }

    //För gästers bokningar:
    if (bookingConfirmation) { bookingConfirmation.classList.add("is_hidden"); }
    if (resultSpot) { resultSpot.classList.add("is_hidden"); }
    if (reservationForm) { reservationForm.addEventListener("submit", addBooking); }
    if (getBookingForm) { getBookingForm.addEventListener("submit", getOneBooking); }

    //För anställda:
    if (loginForm) { loginForm.addEventListener("submit", login); }

    if (adminReservationForm) { adminReservationForm.addEventListener("submit", addAdminBooking); }
    if (adminBookingConfirmation) { adminBookingConfirmation.classList.add("is_hidden"); }
    if (getBookingAdmin) { getBookingAdmin.addEventListener("submit", getOneAdminBooking); }
    if (adminResultDiv) { adminResultDiv.classList.add("is_hidden"); }
    if (adminResultSpot) { adminResultSpot.classList.add("is_hidden"); }
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


//Lägga till bokning (för gäster)
async function addBooking(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedEmail = document.getElementById("email").value;
    const addedPhoneNumber = document.getElementById("phonenumber").value;
    const addedReservationDate = document.getElementById("reservationDate").value;
    const addedReservationTime = document.getElementById("reservationTime").value;
    const addedNumberofPeople = document.getElementById("numberofPeople").value;
    const addedComment = document.getElementById("comment").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("errorUl");
    errorSpot.innerHTML = "";

    if (!addedEmail) { errors.push("Fyll i e-postadress") }
    if (!addedPhoneNumber) { errors.push("Fyll i telefonnummer") }
    if (!addedReservationDate) { errors.push("Fyll i datum") }
    if (!addedReservationTime) { errors.push("Fyll i tid") }
    if (!addedNumberofPeople) { errors.push("Fyll i antal personer") }

    if (errors.length > 0) {
        errors.forEach(error => {
            const newLi = document.createElement("li");
            newLi.textContent = error;
            errorSpot.appendChild(newLi);
        });
        return;
    }

    const booking = {
        email: addedEmail,
        phonenumber: addedPhoneNumber,
        date: addedReservationDate,
        time: addedReservationTime,
        people: addedNumberofPeople,
        comment: addedComment
    }

    try {

        const response = await fetch("http://localhost:3001/guestReservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        })

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);

        document.getElementById("email").value = "";
        document.getElementById("phonenumber").value = "";
        document.getElementById("reservationDate").value = "";
        document.getElementById("reservationTime").value = "";
        document.getElementById("numberofPeople").value = "";
        document.getElementById("comment").value = "";

        const id = data._id;
        const confirmationID = document.getElementById("confirmationID");
        bookingConfirmation.classList.remove("is_hidden");
        confirmationID.textContent = `Ditt bokningsID är: ${id}`;

    } catch (error) {
        console.log(error);
    }
}

//Hämta en bokning via id (för gäster)
async function getOneBooking(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedID = document.getElementById("bookingId").value;

    //Felmeddelanden vid tomma inputfält
    const errorSpot = document.getElementById("getBookingError");
    errorSpot.textContent = "";

    if (!addedID) {
        errorSpot.textContent = "Ange bokningsID";
        return;
    }

    try {

        const response = await fetch(`http://localhost:3001/guestReservation/${addedID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            errorSpot.textContent = `${data.message}`;
            return;

        }

        const date = data.date;
        const fixedDate = new Date(date).toLocaleDateString('sv-SE');

        document.getElementById("bookingId").value = "";

        if (resultSpot) {

            resultSpot.classList.remove("is_hidden");
            resultSpot.innerHTML = "";

            resultSpot.innerHTML += `
                <article>
                <h3>BokningsID: ${data._id}</h3>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefonnummer:</strong> ${data.phonenumber}</p>
                <p><strong>Datum:</strong> ${fixedDate}</p>
                <p><strong>Tid:</strong> ${data.time}</p>
                <p><strong>Antal personer:</strong> ${data.people}</p>
                <p><strong>Kommentar:</strong> ${data.comment}</p>
                </article>`
        }

    } catch (error) {
        console.log(error);
    }
}


//Logga in på registerat konto för anställd
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

        const response = await fetch("http://localhost:3001/employee/login", {
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

//Lägga till bokning (för anställda)
async function addAdminBooking(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedEmail = document.getElementById("ADemail").value;
    const addedPhoneNumber = document.getElementById("ADphonenumber").value;
    const addedReservationDate = document.getElementById("ADreservationDate").value;
    const addedReservationTime = document.getElementById("ADreservationTime").value;
    const addedNumberofPeople = document.getElementById("ADnumberofPeople").value;
    const addedComment = document.getElementById("ADcomment").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("errorUl");
    errorSpot.innerHTML = "";

    if (!addedEmail) { errors.push("Fyll i e-postadress") }
    if (!addedPhoneNumber) { errors.push("Fyll i telefonnummer") }
    if (!addedReservationDate) { errors.push("Fyll i datum") }
    if (!addedReservationTime) { errors.push("Fyll i tid") }
    if (!addedNumberofPeople) { errors.push("Fyll i antal personer") }

    if (errors.length > 0) {
        errors.forEach(error => {
            const newLi = document.createElement("li");
            newLi.textContent = error;
            errorSpot.appendChild(newLi);
        });
        return;
    }

    const booking = {
        email: addedEmail,
        phonenumber: addedPhoneNumber,
        date: addedReservationDate,
        time: addedReservationTime,
        people: addedNumberofPeople,
        comment: addedComment
    }

    const token = localStorage.getItem("Employee-token");

    try {

        const response = await fetch("http://localhost:3001/employeereservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(booking)
        })

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);

        document.getElementById("ADemail").value = "";
        document.getElementById("ADphonenumber").value = "";
        document.getElementById("ADreservationDate").value = "";
        document.getElementById("ADreservationTime").value = "";
        document.getElementById("ADnumberofPeople").value = "";
        document.getElementById("ADcomment").value = "";

        const id = data._id;
        const confirmationID = document.getElementById("ADconfirmationID");
        adminBookingConfirmation.classList.remove("is_hidden");
        confirmationID.textContent = `BokningsID är: ${id}`;

    } catch (error) {
        console.log(error);
    }
}


//Hämta en bokning via id (för anställda)
async function getOneAdminBooking(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const addedID = document.getElementById("ADbookingId").value;

    //Felmeddelanden vid tomma inputfält
    const errorSpot = document.getElementById("adminBookingError");
    errorSpot.textContent = "";

    if (!addedID) {
        errorSpot.textContent = "Ange bokningsID";
        return;
    }

    const token = localStorage.getItem("Employee-token");

    try {

        const response = await fetch(`http://localhost:3001/employeereservation/${addedID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            errorSpot.textContent = `${data.message}`;
            return;

        }

        const date = data.date;
        const fixedDate = new Date(date).toLocaleDateString('sv-SE');

        document.getElementById("ADbookingId").value = "";

        if (adminResultDiv) {

            adminResultDiv.classList.remove("is_hidden");
            adminResultSpot.classList.remove("is_hidden");
            adminResultSpot.innerHTML = "";

            adminResultSpot.innerHTML += `
                <article>
                <h3>BokningsID: ${data._id}</h3>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefonnummer:</strong> ${data.phonenumber}</p>
                <p><strong>Datum:</strong> ${fixedDate}</p>
                <p><strong>Tid:</strong> ${data.time}</p>
                <p><strong>Antal personer:</strong> ${data.people}</p>
                <p><strong>Kommentar:</strong> ${data.comment}</p>
                </article>`
        }

    } catch (error) {
        console.log(error);
    }
}