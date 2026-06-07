
//Denna js-fil hanterar allt som sker på admin.html

//Deklarera variabler
const adminReservationForm = document.getElementById("adminReservationForm");
const adminBookingConfirmation = document.getElementById("adminConfirmation");
const getBookingAdmin = document.getElementById("getBookingAdmin");
const adminResultDiv = document.getElementById("adminResultDiv");
const adminResultSpot = document.getElementById("adminBookingResult");

const allBookings = document.getElementById("allBookings");

const ADupdateButton = document.getElementById("ADupdateButton");
const changeBookingButton = document.getElementById("changeBookingButton");
const deleteBookingButton = document.getElementById("deleteBookingButton");

const adminRegistrationForm = document.getElementById("adminRegistrationForm");

const adminMenuForm = document.getElementById("adminMenuForm");
const menuConfirmation = document.getElementById("menuConfirmation");
const getMealForm = document.getElementById("getMealForm");
const getMealDiv = document.getElementById("getMealDiv");
const mealResult = document.getElementById("mealResult");

const updateMenuButton = document.getElementById("updateMenuButton");
const changeMealButton = document.getElementById("changeMealButton");
const deleteMealButton = document.getElementById("deleteMealButton");

const logOutButton = document.getElementById("logOutButton");


//Variabler för att lagra hämtad bokning eller måltid lokalt
let retrievedBooking = null;
let retrievedMeal = null;


window.addEventListener("DOMContentLoaded", init);

async function init() {


    adminReservationForm.addEventListener("submit", addAdminBooking);
    adminBookingConfirmation.classList.add("is_hidden");

    getBookingAdmin.addEventListener("submit", getOneAdminBooking);
    adminResultDiv.classList.add("is_hidden");
    adminResultSpot.classList.add("is_hidden");

    changeBookingButton.addEventListener("click", changeBooking);

    ADupdateButton.addEventListener("click", updateBooking);

    deleteBookingButton.addEventListener("click", deleteBooking);

    adminRegistrationForm.addEventListener("submit", registerAdmin);

    adminMenuForm.addEventListener("submit", addMeal);
    menuConfirmation.classList.add("is_hidden");

    getMealForm.addEventListener("submit", getOneMeal);
    getMealDiv.classList.add("is_hidden");
    mealResult.classList.add("is_hidden");

    updateMenuButton.addEventListener("click", updateMeal);
    changeMealButton.addEventListener("click", changeMeal);
    deleteMealButton.addEventListener("click", deleteMeal);

    logOutButton.addEventListener("click", () => {
        localStorage.removeItem("Employee-token");
        window.location.href = "employeelogin.html";
    });

    await getAllBookings();
}

//Kontrollera behörighet/utgången token
function expiredToken(response) {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("Employee-token");
        window.location.href = "employeelogin.html";
        return true;    //Om token expired (eller obehörig), returneras true
    }

    return false;       //Annars false
}

//Lägga till bokning 
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
    const errorSpot = document.getElementById("adminErrorUl");
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

        const response = await fetch("https://estraden-webbtj.onrender.com/employeereservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(booking)
        })

        if (expiredToken(response)) return;

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

        adminBookingConfirmation.classList.remove("is_hidden");

        const confirmationHead = document.getElementById("ADconfirmationHead");
        confirmationHead.textContent = `Bokning genomförd!`;

        const confirmationID = document.getElementById("ADconfirmationID");
        confirmationID.textContent = `BokningsID är: ${id}`;

        await getAllBookings();

    } catch (error) {
        console.log(error);
    }
}



//Hämta en bokning via id 
async function getOneAdminBooking(event) {

    event.preventDefault(); //Inte ladda om sidan
    adminBookingConfirmation.classList.add("is_hidden");

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

        const response = await fetch(`https://estraden-webbtj.onrender.com/employeereservation/${addedID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            errorSpot.textContent = `${data.message}`;
            return;

        }

        retrievedBooking = data; //Lägga till data i den lokala varibeln för aktuell hämtad bokning

        const date = data.date;
        const fixedDate = new Date(date).toLocaleDateString('sv-SE');

        document.getElementById("ADbookingId").value = "";

        adminResultDiv.classList.remove("is_hidden");
        adminResultSpot.classList.remove("is_hidden");
        adminResultSpot.innerHTML = "";

        adminResultSpot.innerHTML += `
                <article>
                <h2>BokningsID: ${data._id}</h2>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefonnummer:</strong> ${data.phonenumber}</p>
                <p><strong>Datum:</strong> ${fixedDate}</p>
                <p><strong>Tid:</strong> ${data.time}</p>
                <p><strong>Antal personer:</strong> ${data.people}</p>
                <p><strong>Kommentar:</strong> ${data.comment}</p>
                </article>`

    } catch (error) {
        console.log(error);
    }
}


//Hämta alla bokningar 
async function getAllBookings() {

    const token = localStorage.getItem("Employee-token");

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/employeereservation`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        const allBookingsSpot = document.getElementById("allBookingsResult");
        allBookingsSpot.innerHTML = "";

        if (!response.ok) {
            console.log(data.message);
            allBookingsSpot.textContent = "Kunde inte hämta bokningar.";
            return;

        }

        data.forEach(booking => {

            const date = booking.date;
            const fixedDate = new Date(date).toLocaleDateString('sv-SE');

            const bookingUl = document.createElement("ul");

            const idLi = document.createElement("li");
            idLi.textContent = booking._id;

            const emailLi = document.createElement("li");
            emailLi.textContent = booking.email;

            const phonenumberLi = document.createElement("li");
            phonenumberLi.textContent = booking.phonenumber;

            const dateLi = document.createElement("li");
            dateLi.textContent = fixedDate;

            const timeLi = document.createElement("li");
            timeLi.textContent = booking.time;

            const peopleLi = document.createElement("li");
            peopleLi.textContent = `Antal personer: ${booking.people}`;

            const commentLi = document.createElement("li");
            commentLi.textContent = `Kommentar: ${booking.comment}`;

            allBookingsSpot.appendChild(bookingUl);
            bookingUl.append(
                idLi,
                emailLi,
                phonenumberLi,
                dateLi,
                timeLi,
                peopleLi,
                commentLi
            );

            bookingUl.classList.add("booking-list");

        });

    } catch (error) {
        console.log(error);
    }
}


//Ändra en bokning
function changeBooking() {

    if (!retrievedBooking) return; //Return - om ej GET gjorts, ingen bokning hämtad, ingen data

    const fixedDate = retrievedBooking.date.split("T")[0];  //Rätt datumformat för värdet ska passa i form (date)
    const fixedTime = retrievedBooking.time.replace(".", ":"); //Byta punkt till kolon för värdet ska passa i form (time)

    //Sätta alla värden från hämtad bokning tillbaka i formulär
    document.getElementById("ADemail").value = retrievedBooking.email;
    document.getElementById("ADphonenumber").value = retrievedBooking.phonenumber;
    document.getElementById("ADreservationDate").value = fixedDate;
    document.getElementById("ADreservationTime").value = fixedTime;
    document.getElementById("ADnumberofPeople").value = retrievedBooking.people;
    document.getElementById("ADcomment").value = retrievedBooking.comment;

    document.getElementById("adminReservationForm").scrollIntoView();


    ADupdateButton.classList.remove("is_hidden");
}


//Fortsättning, uppdatera bokning
async function updateBooking() {

    //Värden från input
    const addedEmail = document.getElementById("ADemail").value;
    const addedPhoneNumber = document.getElementById("ADphonenumber").value;
    const addedReservationDate = document.getElementById("ADreservationDate").value;
    const addedReservationTime = document.getElementById("ADreservationTime").value;
    const addedNumberofPeople = document.getElementById("ADnumberofPeople").value;
    const addedComment = document.getElementById("ADcomment").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("adminErrorUl");
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
    const id = retrievedBooking._id;

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/employeereservation/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(booking)
        })

        if (expiredToken(response)) return;

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

        adminResultDiv.classList.add("is_hidden");
        ADupdateButton.classList.add("is_hidden");


        adminBookingConfirmation.classList.remove("is_hidden");

        const confirmationHead = document.getElementById("ADconfirmationHead");
        confirmationHead.textContent = `Bokning uppdaterad!`;

        const confirmationID = document.getElementById("ADconfirmationID");
        confirmationID.textContent = `Bokning uppdaterad, men behåller samma bokningsID!`;

        await getAllBookings();

    } catch (error) {
        console.log(error);
    }

}


//Radera bokning
async function deleteBooking() {

    if (!retrievedBooking) return;  //Return - om ej GET gjorts, ingen bokning hämtad, ingen data

    const token = localStorage.getItem("Employee-token");
    const id = retrievedBooking._id;

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/employeereservation/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);
        retrievedBooking = null; //Data "tömd" igen när den är raderad

        //Rensa dölja gammal bokningsinformation
        adminResultSpot.innerHTML = "";
        adminResultDiv.classList.add("is_hidden");

        //Bekräftelse på radering
        adminBookingConfirmation.classList.remove("is_hidden");
        const confirmationHead = document.getElementById("ADconfirmationHead");
        confirmationHead.textContent = `Bokning raderad!`;
        const confirmationID = document.getElementById("ADconfirmationID");
        confirmationID.textContent = "";

        await getAllBookings();

    } catch (error) {
        console.log(error);
    }

}


//Registrera konto för anställd
async function registerAdmin(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const registeredEmail = document.getElementById("regEmail").value;
    const registeredPassword = document.getElementById("regPassword").value;

    //Felmeddelanden vid tomma inputfält
    const regErrors = [];
    const errorSpot = document.getElementById("regErrorUl");
    errorSpot.innerHTML = "";

    if (!registeredEmail) {
        regErrors.push("Ange E-postadress")
    }
    if (!registeredPassword) {
        regErrors.push("Ange lösenord")
    }

    if (regErrors.length > 0) {
        regErrors.forEach(error => {
            const newLi = document.createElement("li");
            newLi.textContent = error;
            errorSpot.appendChild(newLi);
        });

        return;
    }

    let employee = {
        email: registeredEmail,
        password: registeredPassword
    }

    try {

        const response = await fetch("https://estraden-webbtj.onrender.com/employee/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })


        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);

            const errorSpot = document.getElementById("regErrorP");

            errorSpot.textContent = data.message;

            return;
        }

        document.getElementById("regEmail").value = "";
        document.getElementById("regPassword").value = "";

        document.getElementById("registrationConfirmation").classList.remove("is_hidden");
        document.getElementById("registrationHead").textContent = "Konto registrerat!"

    } catch (error) {
        console.log(error);
    }

}


//Lägga till måltid i meny
async function addMeal(event) {

    event.preventDefault(); //Inte ladda om sidan

    //Värden från input
    const mealName = document.getElementById("mealName").value;
    const mealDescription = document.getElementById("mealDescription").value;
    const mealPrice = document.getElementById("mealPrice").value;
    const mealType = document.getElementById("mealType").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("menuErrorUl");
    errorSpot.innerHTML = "";

    if (!mealName) { errors.push("Fyll i måltidsnamn"); }
    if (!mealDescription) { errors.push("Fyll i måltidsbeskrivning"); }
    if (!mealPrice) { errors.push("Fyll i måltidspris"); }

    if (errors.length > 0) {
        errors.forEach(error => {
            const newLi = document.createElement("li");
            newLi.textContent = error;
            errorSpot.appendChild(newLi);
        });
        return;
    }

    const meal = {
        mealname: mealName,
        mealdescription: mealDescription,
        mealprice: mealPrice,
        mealtype: mealType
    }

    const token = localStorage.getItem("Employee-token");

    try {

        const response = await fetch("https://estraden-webbtj.onrender.com/menu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(meal)
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);

        document.getElementById("mealName").value = "";
        document.getElementById("mealDescription").value = "";
        document.getElementById("mealPrice").value = "";

        const id = data._id;

        menuConfirmation.classList.remove("is_hidden");

        const menuConfHead = document.getElementById("menuConfHead");
        menuConfHead.textContent = `Måltid/dryck skapad!`;

        const menuConfID = document.getElementById("menuConfID");
        menuConfID.textContent = `MåltidsID/DryckID är: ${id} (Spara denna!)`;

    } catch (error) {
        console.log(error);
    }
}


//Hämta en måltid via id 
async function getOneMeal(event) {

    event.preventDefault(); //Inte ladda om sidan
    menuConfirmation.classList.add("is_hidden");

    //Värden från input
    const addedID = document.getElementById("getMealId").value;

    //Felmeddelanden vid tomma inputfält
    const errorSpot = document.getElementById("getMealError");
    errorSpot.textContent = "";

    if (!addedID) {
        errorSpot.textContent = "Ange bokningsID eller dryckID";
        return;
    }

    const token = localStorage.getItem("Employee-token");

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/menu/${addedID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            errorSpot.textContent = `${data.message}`;
            return;

        }

        retrievedMeal = data; //Lägga till data i den lokala varibeln för aktuell hämtad måltid

        document.getElementById("getMealId").value = "";

        getMealDiv.classList.remove("is_hidden");
        mealResult.classList.remove("is_hidden");
        mealResult.innerHTML = "";

        mealResult.innerHTML += `
                <article>
                <h2>MåltidsID eller dryckID: ${data._id}</h2>
                <p><strong>Måltidsnamn:</strong> ${data.mealname}</p>
                <p><strong>Måltidsbeskrivning:</strong> ${data.mealdescription}</p>
                <p><strong>Måltidspris:</strong> ${data.mealprice}</p>
                <p><strong>Typ:</strong> ${data.mealtype}</p>
                </article>`

    } catch (error) {
        console.log(error);
    }
}


//Ändra en måltid
function changeMeal() {

    if (!retrievedMeal) return; //Return - om ej GET gjorts, måltid hämtad, ingen data

    //Sätta alla värden från hämtad bokning tillbaka i formulär
    document.getElementById("mealName").value = retrievedMeal.mealname;
    document.getElementById("mealDescription").value = retrievedMeal.mealdescription;
    document.getElementById("mealPrice").value = retrievedMeal.mealprice;
    document.getElementById("mealType").value = retrievedMeal.mealtype;

    document.getElementById("adminMenuForm").scrollIntoView();


    updateMenuButton.classList.remove("is_hidden");
}



//Fortsättning, uppdatera måltid
async function updateMeal() {

    //Värden från input
    const mealName = document.getElementById("mealName").value;
    const mealDescription = document.getElementById("mealDescription").value;
    const mealPrice = document.getElementById("mealPrice").value;
    const mealType = document.getElementById("mealType").value;

    //Felmeddelanden vid tomma inputfält
    const errors = [];
    const errorSpot = document.getElementById("menuErrorUl");
    errorSpot.innerHTML = "";

    if (!mealName) { errors.push("Fyll i måltidsnamn"); }
    if (!mealDescription) { errors.push("Fyll i måltidsbeskrivning"); }
    if (!mealPrice) { errors.push("Fyll i måltidspris"); }

    if (errors.length > 0) {
        errors.forEach(error => {
            const newLi = document.createElement("li");
            newLi.textContent = error;
            errorSpot.appendChild(newLi);
        });
        return;
    }

    const meal = {
        mealname: mealName,
        mealdescription: mealDescription,
        mealprice: mealPrice,
        mealtype: mealType
    }

    const token = localStorage.getItem("Employee-token");
    const id = retrievedMeal._id;

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/menu/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(meal)
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);

        document.getElementById("mealName").value = "";
        document.getElementById("mealDescription").value = "";
        document.getElementById("mealPrice").value = "";

        getMealDiv.classList.add("is_hidden");
        updateMenuButton.classList.add("is_hidden");


        menuConfirmation.classList.remove("is_hidden");

        const menuConfHead = document.getElementById("menuConfHead");
        menuConfHead.textContent = `Måltid uppdaterad!`;

        const menuConfID = document.getElementById("menuConfID");
        menuConfID.textContent = `Måltid uppdaterad, men behåller samma måltidsID eller dryckID!`;

    } catch (error) {
        console.log(error);
    }

}

//Radera måltid
async function deleteMeal() {

    if (!retrievedMeal) return;  //Return - om ej GET gjorts, ingen måltid hämtad, ingen data

    const token = localStorage.getItem("Employee-token");
    const id = retrievedMeal._id;

    try {

        const response = await fetch(`https://estraden-webbtj.onrender.com/menu/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        if (expiredToken(response)) return;

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;

        }

        console.log(data);
        retrievedMeal = null; //Data "tömd" igen när den är raderad

        //Rensa dölja gammal måltidsinformation
        mealResult.innerHTML = "";
        getMealDiv.classList.add("is_hidden");

        //Bekräftelse på radering
        menuConfirmation.classList.remove("is_hidden");
        const menuConfHead = document.getElementById("menuConfHead");
        menuConfHead.textContent = `Måltid raderad!`;
        const menuConfID = document.getElementById("menuConfID");
        menuConfID.textContent = "";

    } catch (error) {
        console.log(error);
    }

}