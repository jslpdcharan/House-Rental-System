import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home_Page from "./pages/Home_Page";
import Add_Property from "./pages/Add_Property";
import Request_Status from "./pages/Request_Status";
import React, {useState,useEffect} from "react";
import './components/NavBar';
import No_Page from "./pages/No_Page";
import Admin_Login from "./pages/Admin_Login";
import Customer_Login from "./pages/Customer_Login";
import Property_Login from "./pages/Property_Login";
import Customer_Records_Display from "./pages/Customer_Records_Display";

export default function App(){return (
      <div>
          <BrowserRouter>
              <Routes>
                  <Route index element ={<Home_Page/>} />
                  <Route path="/home" element ={<Home_Page/>} />
                  <Route path="/home/add_property" element ={<Add_Property/>} />
                  <Route path="/home/request_status" element ={<Request_Status/>} />
                  <Route path="/home/admin_login" element ={<Admin_Login/>} />
                  <Route path="/home/customer_login" element ={<Customer_Login/>} />
                  <Route path="/home/property_login" element ={<Property_Login/>} />
                  <Route path="/home/customer_login/customer_records/:phone/:ssn/:first_name" element={<Customer_Records_Display />} />
                  <Route path="*" element ={<No_Page/>} />
              </Routes>
          </BrowserRouter>
      </div>
  )
}


