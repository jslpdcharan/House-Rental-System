import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';


function NavBar() {
    const [open,setOPen] =useState(false);
    const navigate = useNavigate();
    const home_page = (event) => {
        event.preventDefault();
        navigate("/home");
    };
    const add_property_link = (event) => {
        event.preventDefault();
        navigate("/home/add_property");
    };
    const request_status = (event) => {
        event.preventDefault();
        navigate("/home/request_status");
    };
    const admin_login = (event) => {
        event.preventDefault();
        navigate("/home/admin_login");
    };
    const customer_login = (event) => {
        event.preventDefault();
        navigate("/home/customer_login");
    };
    const property_login = (event) => {
        event.preventDefault();
        navigate("/home/property_login");
    };

    return (
        <div>
            <nav>
                <div className="logo" >Rental System</div>
                <ul className="nav-links" style={{transform: open ? "translateX(0px)" : ""}}>
                    <li><a href="home" onClick={home_page}> Home</a></li>
                    <li><a href="home/add_property" onClick={add_property_link}> Add Property</a></li>
                    <li><a href="home/request_status" onClick={request_status}> Request Status</a></li>
                    <li><a href="home/admin_login" onClick={admin_login}> Admin Login</a></li>
                    <li><a href="home/customer_login" onClick={customer_login}> Customer Login</a></li>
                    <li><a href="home/property_login" onClick={property_login}> Property Login</a></li>
                </ul>
                <i  onClick={() => setOPen(!open)} className="fas fa-bars menu"></i>
            </nav>
        </div>
    )
}

export default NavBar