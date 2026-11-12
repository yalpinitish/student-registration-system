
import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    deleteUser,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    ref,
    set,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

console.log("Firebase registration script loaded");

// Get HTML elements
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const registerButton = document.getElementById("registerButton");

// Show or hide password
document.getElementById("showPassword")
    .addEventListener("change", function () {

        const type = this.checked ? "text" : "password";

        document.getElementById("password").type = type;
        document.getElementById("confirmPassword").type = type;
    });

// Registration form submission
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("Register button clicked");

    const fullName = document.getElementById("fullName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim().toUpperCase();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Display messages
    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
    }

    // Validate required fields
    if (!fullName || !rollNumber || !email ||
        !phone || !dob || !gender || !department ||
        !year || !password || !confirmPassword) {

        showMessage("Please fill in all fields.", "error");
        return;
    }

    if (fullName.length < 2) {
        showMessage("Please enter a valid name.", "error");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showMessage("Enter a valid 10-digit phone number.", "error");
        return;
    }

    if (password.length < 8) {
        showMessage("Password must contain at least 8 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    let user = null;
    let profileSaved = false;

    try {

        // Create Firebase Authentication account
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        user = userCredential.user;

        console.log("Authentication successful:", user.uid);

        // Prepare student data
        const studentData = {
            uid: user.uid,
            fullName: fullName,
            rollNumber: rollNumber,
            email: user.email,
            phone: phone,
            dob: dob,
            gender: gender,
            department: department,
            year: Number(year),
            createdAt: serverTimestamp()
        };

        // Save data in Firebase Realtime Database
        await set(
            ref(db, "students/" + user.uid),
            studentData
        );

        profileSaved = true;

        console.log("Student data stored successfully");

        // Clear registration form
        form.reset();

        document.getElementById("password").type = "password";
        document.getElementById("confirmPassword").type = "password";

        showMessage(
            "Student registered successfully!",
            "success"
        );

        // Sign out after registration
        try {
            await signOut(auth);
        } catch (signOutError) {
            console.warn("Sign-out failed:", signOutError);
        }

    } catch (error) {

        console.error("Firebase error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        // Remove incomplete authentication account
        if (user && !profileSaved) {
            try {
                await deleteUser(user);
            } catch (cleanupError) {
                console.error("Account cleanup failed:", cleanupError);
            }
        }

        if (error.code === "auth/email-already-in-use") {

            showMessage("Email is already registered.", "error");

        } else if (error.code === "auth/invalid-email") {

            showMessage("Invalid email address.", "error");

        } else if (error.code === "auth/weak-password") {

            showMessage("Please enter a stronger password.", "error");

        } else {

            showMessage(
                "Registration failed: " + error.message,
                "error"
            );
        }

    } finally {

        registerButton.disabled = false;
        registerButton.textContent = "Register Now";
    }
});
