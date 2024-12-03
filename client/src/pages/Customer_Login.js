import React from 'react';
import NavBar from "../components/NavBar";
import CustomerForm from "../components/Customer_Form";
import "../styles/CustomerForm.css"; // Import a CSS file for styling

// Added Customer Login page that is routed to the customer Form
export default function Customer_Login(){
    return (
        <>
            <NavBar />
            <CustomerForm/>>
            </>
    )
}