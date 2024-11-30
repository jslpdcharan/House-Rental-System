import React, { useState } from 'react';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import App from "../App";
import {grey} from "@mui/material/colors";

function CustomerForm() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email_id, setEmailId] = useState('');
    const [occupation, setOccupation] = useState('');
    const [annual_income, setAnnualIncome] = useState('');
    const [dob, setDob] = useState('');
    const [ssn, setSSN] = useState('');
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
            ssn
        })
            .then(response => {
                console.log("Server response:", response);
                create_form_reset();
                alert("Record Successfully Inserted into the Approval Property List Table");
                navigate("/home");
            })
            .catch(error => {
                console.error("Detailed error:", error.response.data);
                alert("Error updating the . Please try again later.");
            });
    };


    const authenticate_customer = () => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/customer_login`, {
            ssn: ssn,
            phone: phone
        })
            .then(response => {
                if(response.data.success) {
                    navigate(`/home/customer_login/customer_records/${phone}/${ssn}/${first_name}`);
                } else {
                    alert('Incorrect ssn or phone');
                    resetForm();
                }
            })
            .catch(error => {
                console.error("Error during authentication:", error);
                alert("An error occurred. Please try again later.");
            });
    };

    const resetForm = () => {
        setSSN('');
        setPhone('');
        setFirstName('');
    };
    const create_form_reset = () => {
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmailId('');
        setOccupation('');
        setAnnualIncome('');
        setSSN('');
        setDob('');
    };

    return (
        <center>
        <div>
            <div>
                <h2>Login or Sign Up</h2>
                <br></br>
            <button onClick={() => setMode('create')}>Create Account</button>
            <button onClick={() => setMode('login')}>Login Account</button>
            </div>
            {mode === 'create' && (
                <div>
                        <h2>Customer Create Account</h2>
                    <div className={App}>
                        <br></br>
                        <div className="property_form">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" id="first_name" value={first_name} onChange={e => setFirstName(e.target.value)} />
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" id="last_name" value={last_name} onChange={e => setLastName(e.target.value)} />
                            <label htmlFor="phone_number">Phone Number</label>
                            <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                            <label htmlFor="email_id">Email Id</label>
                            <input type="text" id="email_id" value={email_id} onChange={e => setEmailId(e.target.value)} />
                            <label htmlFor="occupation">Occupation</label>
                            <input type="text" id="occupation" value={occupation} onChange={e => setOccupation(e.target.value)} />
                            <label htmlFor="annual_income">Annual Income</label>
                            <input type="number" id="annual_income" value={annual_income} onChange={e => setAnnualIncome(e.target.value)} />
                            <label htmlFor="dob">Date Of Birth(yyyy-mm-dd)</label>
                            <input type="text" id="dob" value={dob} onChange={e => setDob(e.target.value)} />
                            <label htmlFor="ssn">SSN</label>
                            <input type="password" id="ssn" value={ssn} onChange={e => setSSN(e.target.value)} />
                            <button onClick={handleCreateAccount}>Login</button>
                        </div>
                    </div>
                </div>
            )}

            {mode === 'login' && (
                <div>
                    <div className={App}>
                        <div className="property_form">
                        <h2>Login</h2>
                            <br></br>
                            <label htmlFor="first_name">First Name</label>
                        <input type="text" id="first_name" value={first_name} onChange={e => setFirstName(e.target.value)} />
                        <label htmlFor="phone_number">Phone Number</label>
                        <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        <label htmlFor="ssn">SSN</label>
                        <input type="password" id="ssn" value={ssn} onChange={e => setSSN(e.target.value)} />
                        <button onClick={authenticate_customer}>Login</button>
                    </div>
                </div>
                </div>
            )}
        </div>
        </center>
    );
}

export default CustomerForm;
