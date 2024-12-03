import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerForm.css"; // Import a CSS file for styling

function CustomerForm() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email_id, setEmailId] = useState("");
    const [occupation, setOccupation] = useState("");
    const [annual_income, setAnnualIncome] = useState("");
    const [dob, setDob] = useState("");
    const [ssn, setSSN] = useState("");
    const [mode, setMode] = useState(null);
    const navigate = useNavigate();

    const handleCreateAccount = () => {
        if (!first_name || !last_name || !phone || !email_id || !occupation || !annual_income || !dob || !ssn) {
            alert("All fields are required!");
            return;
        }
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_customer_records`, {
            first_name,
            last_name,
            phone,
            email_id,
            occupation,
            annual_income,
            dob,
            ssn,
        })
            .then(() => {
                createFormReset();
                alert("Record successfully created!");
                navigate("/home");
            })
            .catch((error) => {
                console.error("Error:", error.response.data);
                alert("Error creating account. Please try again.");
            });
    };

    const authenticateCustomer = () => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/customer_login`, {
            ssn,
            phone,
        })
            .then((response) => {
                if (response.data.success) {
                    navigate(`/home/customer_login/customer_records/${phone}/${ssn}/${first_name}`);
                } else {
                    alert("Incorrect SSN or phone number.");
                    resetForm();
                }
            })
            .catch((error) => {
                console.error("Error during authentication:", error);
                alert("Authentication failed. Please try again.");
            });
    };

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmailId("");
        setOccupation("");
        setAnnualIncome("");
        setDob("");
        setSSN("");
    };

    const createFormReset = () => {
        resetForm();
    };

    return (
        <div className="customer-form-container">
            <h1>Customer Portal</h1>
            <div className="button-group">
                <button className="action-button" onClick={() => setMode("create")}>
                    Create Account
                </button>
                <button className="action-button" onClick={() => setMode("login")}>
                    Login
                </button>
            </div>

            {mode === "create" && (
                <div className="form-wrapper">
                    <h2>Create Account</h2>
                    <form className="form">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                        />

                        <label>Last Name</label>
                        <input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                        />

                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email_id}
                            onChange={(e) => setEmailId(e.target.value)}
                            placeholder="Enter your email"
                        />

                        <label>Occupation</label>
                        <input
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="Enter your occupation"
                        />

                        <label>Annual Income</label>
                        <input
                            type="number"
                            value={annual_income}
                            onChange={(e) => setAnnualIncome(e.target.value)}
                            placeholder="Enter your annual income"
                        />

                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />

                        <label>SSN</label>
                        <input
                            type="password"
                            value={ssn}
                            onChange={(e) => setSSN(e.target.value)}
                            placeholder="Enter your SSN"
                        />

                        <button type="button" className="submit-button" onClick={handleCreateAccount}>
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {mode === "login" && (
                <div className="form-wrapper">
                    <h2>Login</h2>
                    <form className="form">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                        />

                        <label>SSN</label>
                        <input
                            type="password"
                            value={ssn}
                            onChange={(e) => setSSN(e.target.value)}
                            placeholder="Enter your SSN"
                        />

                        <button type="button" className="submit-button" onClick={authenticateCustomer}>
                            Login
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CustomerForm;
