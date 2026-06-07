"use strict";

if (!localStorage.getItem("Employee-token")) {
    window.location.href = "employeelogin.html";
}