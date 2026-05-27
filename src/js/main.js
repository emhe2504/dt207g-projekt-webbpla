
//Denna js-fil hanterar allt som sker på admin.html

//Deklarera variabler
const adminReservationForm = document.getElementById("adminReservationForm");
const adminBookingConfirmation = document.getElementById("adminConfirmation");
const getBookingAdmin = document.getElementById("getBookingAdmin");
const adminResultDiv = document.getElementById("adminResultDiv");
const adminResultSpot = document.getElementById("adminBookingResult");

const changeBookingButton = document.getElementById("changeBookingButton");
const ADupdateButton = document.getElementById("ADupdateButton");
const deleteBookingButton = document.getElementById("deleteBookingButton");

const adminRegistrationForm = document.getElementById("adminRegistrationForm");


//Variabel för att lagra hämtad bokning lokalt
let retrievedBooking = null;



window.addEventListener("DOMContentLoaded", init);

function init() {


    if (adminReservationForm) { adminReservationForm.addEventListener("submit", addAdminBooking); }
    if (adminBookingConfirmation) { adminBookingConfirmation.classList.add("is_hidden"); }

    if (getBookingAdmin) { getBookingAdmin.addEventListener("submit", getOneAdminBooking); }
    if (adminResultDiv) { adminResultDiv.classList.add("is_hidden"); }
    if (adminResultSpot) { adminResultSpot.classList.add("is_hidden"); }

    if (changeBookingButton) {
        changeBookingButton.addEventListener("click", changeBooking);
    }

    if (ADupdateButton) {
        ADupdateButton.addEventListener("click", updateBooking);
    }

    if (deleteBookingButton) {
        deleteBookingButton.addEventListener("click", deleteBooking);
    }

    if (adminRegistrationForm) { adminRegistrationForm.addEventListener("submit", registerAdmin); }
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

        adminBookingConfirmation.classList.remove("is_hidden");

        const confirmationHead = document.getElementById("ADconfirmationHead");
        confirmationHead.textContent = `Bokning genomförd!`;

        const confirmationID = document.getElementById("ADconfirmationID");
        confirmationID.textContent = `BokningsID är: ${id}`;

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

        retrievedBooking = data; //Lägga till data i den lokala varibeln för aktuell hämtad bokning

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

        const response = await fetch(`http://localhost:3001/employeereservation/${id}`, {
            method: "PUT",
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

        adminResultDiv.classList.add("is_hidden");
        ADupdateButton.classList.add("is_hidden");


        adminBookingConfirmation.classList.remove("is_hidden");

        const confirmationHead = document.getElementById("ADconfirmationHead");
        confirmationHead.textContent = `Bokning uppdaterad!`;

        const confirmationID = document.getElementById("ADconfirmationID");
        confirmationID.textContent = `Bokning uppdaterad, men behåller samma bokningsID!`;

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

        const response = await fetch(`http://localhost:3001/employeereservation/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

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

    } catch (error) {
        console.log(error);
    }

}


//Registrera konto för anställd
async function registerAdmin() {

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
    regErrors.forEach(error => {
        const newLi = document.createElement("li");
        newLi.textContent = error;
        errorSpot.appendChild(newLi);
    });

    let employee = {
        email: registeredEmail,
        password: registeredPassword
    }

    try {

        const response = await fetch("http://localhost:3001/employee/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })


        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);


        }

        document.getElementById("regEmail").value = "";
        document.getElementById("regPassword").value = "";

        document.getElementById("registrationConfirmation").classList.remove("is_hidden");
        document.getElementById("registrationHead").textContent = "Konto registrerat!"

    } catch (error) {
    console.log(error);
}

}