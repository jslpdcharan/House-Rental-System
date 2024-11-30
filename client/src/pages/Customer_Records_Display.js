import { useParams } from 'react-router-dom';
import NavBar from "../components/NavBar";
import React, {useEffect, useState} from "react";
import Axios from "axios";

export default function Customer_Records_Display() {
    const [records, setRecords] = useState([]);
    const [customer_records, setCustomerRecords] = useState([]);

    const { first_name,phone, ssn } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // To update the records as soon as I render this page
    useEffect(() => {
        fetchCustomerRecords();
        fetchRecords();
        console.log(records.data);
    }, [first_name,phone, ssn]);

    // button that reverts the page to the customer leased properties
    const pushleaseinformation = () => {
        fetchCustomerRecords();
        setIsLoggedIn(true);
    };

    // button that go back to the available rental properties to rent
    const popcustomerinfo =()=>{
      setIsLoggedIn(false);
    };

    // get the customer leased houses
    const fetchCustomerRecords = () => {
        console.log(ssn);
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_customer_rental_information`, {
            params: { ssn }
        })
            .then(response => {
                setCustomerRecords(response.data);
            })
            .catch(error => {
                console.error("Error fetching Leased Properties:", error);
                alert("Failed to fetch Leased Properties. Please try again later.");
            })
    };
    // fetch the available houses for rent
    const fetchRecords = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_rent_availability`)
            .then(response => {
                setRecords(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error fetching records:", error);
                alert("Failed to fetch records. Please try again later.");
            });
    };

    // Update the lease status as leased in the database
    const update_property_lease_status = (ein,house_number,status,id) => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_lease_status`, {
            // EIN, HOUSE_NUMBER, SSN, FIRST_NAME
            ein :ein,
            house_number :house_number,
            ssn:ssn,
            first_name:first_name,
            status:status,
            id:id
        })
            .then(response => {
                alert('Lease Status  Updated Successfully');
                fetchRecords();
            })
            .catch(error => {
                alert("Unable to Lease property, please try again");
            });
    };

    // Insert the maintenance record into the table
    const add_maintenance_record = (ein,house_number,address,status) => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/add_maintenance_record`, {
            // EIN, HOUSE_NUMBER, SSN, FIRST_NAME
            ein:ein,
            house_number:house_number,
            address:address,
            status:status,
            ssn:ssn
        })
            .then(response => {
                alert('Maintenance Request Submitted');
                fetchRecords();
            })
            .catch(error => {
                alert("Unable to add Maintenance Request, Please try again");
            });
    };
    const update_vacant_status = (status,house_number,ssn) => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_vacant_status`, {
            // EIN, HOUSE_NUMBER, SSN, FIRST_NAME
            status:status,
            house_number:house_number,
            ssn:ssn
        })
            .then(response => {
                alert('Lease Status  Updated Successfully Submitted');
                fetchRecords();
            })
            .catch(error => {
                alert("Unable to update  lease  status, Please try again");
            });
    };


    return (
        <>
        <NavBar />
            <div>
            {!isLoggedIn ? (
                <div className={"print_records"}>
                    <button  onClick={pushleaseinformation} >Leased Properties</button>
                    <center>
                        <h2>List of Available Properties to Lease</h2>
                        <br></br>

                    </center>
                    <table>
                        <thead>
                        <tr>
                            <th>Rental Id</th>
                            <th>EIN</th>
                            <th>HOUSE_TYPE</th>
                            <th>HOUSE_NUMBER</th>
                            <th>PROPERTY_NAME</th>
                            <th>ADDRESS</th>
                            <th>EMAIL_ID</th>
                            <th>PHONE_NUMBER</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((r, i) => (
                            <tr key={i}>
                                <td>{r.RENTAL_ID}</td>
                                <td>{r.EIN}</td>
                                <td>{r.HOUSE_TYPE}</td>
                                <td>{r.HOUSE_NUMBER}</td>
                                <td>{r.PROPERTY_NAME}</td>
                                <td>{r.ADDRESS}</td>
                                <td>{r.EMAIL_ID}</td>
                                <td>{r.PHONE_NUMBER}</td>
                                <td>
                                    <button onClick={() => update_property_lease_status(r.RENTAL_ID,r.EIN, r.HOUSE_NUMBER,'LEASED',r.RENTAL_ID)}>Lease Property</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ): (
                <div className={"print_records"}>
                    <button onClick={popcustomerinfo}>Go Back</button>
                    <br></br>
                    <h2>Customer Lease Information</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>HOUSE_NUMBER</th>
                            <th>PROPERTY_NAME</th>
                            <th>HOUSE_TYPE</th>
                            <th>ADDRESS</th>
                            <th>RENTAL_STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customer_records.map((r, i) => (
                            <tr key={i}>
                                <td>{r.HOUSE_NUMBER}</td>
                                <td>{r.PROPERTY_NAME}</td>
                                <td>{r.HOUSE_TYPE}</td>
                                <td>{r.ADDRESS}</td>
                                <td>{r.RENTAL_STATUS}</td>
                                <td>
                                    <button onClick={() => update_vacant_status('VACANT',r.HOUSE_NUMBER,ssn)}>Break Lease</button>
                                </td>
                                <td>
                                    <button onClick={() => add_maintenance_record(r.EIN,r.HOUSE_NUMBER,r.ADDRESS,'SUBMITTED')}>Maintenance</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            )}
            </div>
        </>
    );
}