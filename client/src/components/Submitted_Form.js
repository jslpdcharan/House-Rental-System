import React, { useState } from "react";
import Axios from 'axios';

function Submitted_Form() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [records, setRecords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const authenticate_admin = () => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/admin_login`, {
            username: username,
            password: password
        })
            .then(response => {
                if(response.data.success) {
                    setIsLoggedIn(true);
                    fetchRecords();
                } else {
                    alert('Incorrect username or password');
                    resetForm();
                }
            })
            .catch(error => {
                console.error("Error during authentication:", error);
                alert("An error occurred. Please try again later.");
            });
    };
    const update_property_status = (ein,house_number,property_name,status) => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_approval_status_list`, {
            // EIN, HOUSE_NUMBER, PROPERTY_NAME
            ein :ein,
            house_number :house_number,
            property_name :property_name,
            status:status
        })
            .then(response => {
                alert('Record Updated Successfully');
                fetchRecords();
            })
            .catch(error => {
                alert("Unable to Update record, please try again");
            });
    };

    const fetchRecords = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_submitted_records`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.error("Error fetching records:", error);
                alert("Failed to fetch records. Please try again later.");
            });
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            {!isLoggedIn ? (
                <div className="property_form">
                    <h2>Admin Login  </h2>
                    <br></br>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />

                    <button onClick={authenticate_admin}>Login</button>
                </div>
            ) : (
                <div className={"print_records"}>
                    <table>
                        <thead>
                        <tr>
                            <th>EIN</th>
                            <th>OWNER_NAME</th>
                            <th>PROPERTY_NAME</th>
                            <th>HOUSE_NUMBER</th>
                            <th>ADDRESS</th>
                            <th>EMAIL_ID</th>
                            <th>PHONE_NUMBER</th>
                            <th>HOUSE_TYPE</th>
                            <th>APPROVAL_STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((r, i) => (
                            <tr key={i}>
                                <td>{r.EIN}</td>
                                <td>{r.OWNER_NAME}</td>
                                <td>{r.PROPERTY_NAME}</td>
                                <td>{r.HOUSE_NUMBER}</td>
                                <td>{r.ADDRESS}</td>
                                <td>{r.EMAIL_ID}</td>
                                <td>{r.PHONE_NUMBER}</td>
                                <td>{r.HOUSE_TYPE}</td>
                                <td>{r.APPROVAL_STATUS}</td>
                                <td>
                                    <button onClick={() => update_property_status(r.EIN, r.PROPERTY_NAME, r.HOUSE_NUMBER, 'IN_PROGRESS')}>InProgress</button>
                                </td>
                                <td>
                                    <button onClick={() => update_property_status(r.EIN, r.PROPERTY_NAME, r.HOUSE_NUMBER, 'APPROVED')}>Approved</button>
                                </td>
                                <td>
                                    <button onClick={() => update_property_status(r.EIN, r.PROPERTY_NAME, r.HOUSE_NUMBER, 'REJECTED')}>Rejected</button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}


export default Submitted_Form;
