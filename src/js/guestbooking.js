
//Denna js-fil hanterar gästbokningar, göra samt hämta bokning

const reservationForm = document.getElementById("reservationForm");
const bookingConfirmation = document.getElementById("confirmation");
const getBookingForm = document.getElementById("getBookingForm");
const resultSpot = document.getElementById("bookingResult");


window.addEventListener("DOMContentLoaded", init);

function init() {

    if (reservationForm) { reservationForm.addEventListener("submit", addBooking); }
    if (getBookingForm) { getBookingForm.addEventListener("submit", getOneBooking); }

    if (bookingConfirmation) { bookingConfirmation.classList.add("is_hidden"); }
    if (resultSpot) { resultSpot.classList.add("is_hidden"); }
}




//Gäster lägger till bokning

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
    const errorSpot = document.getElementById("guestErrorUl");
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

        const response = await fetch("https://estraden-webbtj.onrender.com/guestReservation", {
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


//Gäster hämtar och ser sin bokning via id

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

        const response = await fetch(`https://estraden-webbtj.onrender.com/guestReservation/${addedID}`, {
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