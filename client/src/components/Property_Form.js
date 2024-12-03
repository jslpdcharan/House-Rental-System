import React, { useState} from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
function PropertyForm() {
    // variables for the update property table
    const [owner_name, setOwnerName] = useState('');
    const [ein, setEin] = useState('');
    const [email_id, setEmailId] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [house_type, setHouseType] = useState('');
    const [house_number, setHouseNumber] = useState('');
    const [address, setAddress] = useState('');
    const [property_name, setPropertyName] = useState('');
    const navigate = useNavigate();
    const submitReview = () => {
        if (!owner_name || !ein || !email_id || !phone_number || !house_type || !house_number || !address || !property_name) {
            alert("All fields are required!");
            return;
        }
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_approval_property_list`, {
            owner_name,
            ein,
            email_id,
            phone_number,
            house_type,
            house_number,
            address,
            property_name
        })
            .then(response => {
                console.log("Server response:", response);
                resetForm();
                alert("Record Successfully Inserted into the Approval Property List Table");
                navigate("/home");
            })
            .catch(error => {
                console.error("Error updating approval property list:", error);
                alert("Error updating approval property list. Please try again later.");
                resetForm();
            });
    };
    const resetForm = () => {
        setOwnerName('');
        setEin('');
        setEmailId('');
        setPhoneNumber('');
        setHouseType('');
        setHouseNumber('');
        setAddress('');
        setPropertyName('');
    };

    return (
        <div className="App">
            <h2>Property Registration Form</h2>
            <div className="property_form">
                <br></br>
                <label htmlFor="owner_name">Owner Name</label>
                <input type="text" id="owner_name" value={owner_name} onChange={e => setOwnerName(e.target.value)} />

                <label htmlFor="ein">EIN</label>
                <input type="password" id="ein" value={ein} onChange={e => setEin(e.target.value)} />

                <label htmlFor="email_id">Email Id</label>
                <input type="text" id="email_id" value={email_id} onChange={e => setEmailId(e.target.value)} />

                <label htmlFor="phone_number">Phone Number</label>
                <input type="text" id="phone_number" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} />

                <label htmlFor="house_type">House Type('APARTMENT','STUDIO','INDIVIDUAL_HOUSE','OTHER')</label>
                <input type="text" id="house_type" value={house_type} onChange={e => setHouseType(e.target.value)} />

                <label htmlFor="house_number">House Number</label>
                <input type="text" id="house_number" value={house_number} onChange={e => setHouseNumber(e.target.value)} />

                <label htmlFor="address">Address</label>
                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} />

                <label htmlFor="property_name">Property Name</label>
                <input type="text" id="property_name" value={property_name} onChange={e => setPropertyName(e.target.value)} />

                <button onClick={submitReview}>Submit</button>
            </div>
        </div>
    );
}

export default PropertyForm;
