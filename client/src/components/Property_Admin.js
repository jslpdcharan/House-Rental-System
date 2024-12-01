import React, { useState } from "react";
import Axios from 'axios';

function Property_Admin() {
    const [ein, setEin] = useState('');
    const [id, setid] = useState('');
    const [records, setRecords] = useState([]);
    const [maintenance_records, setMaintenancerecords] = useState([]);
    const [owner_name, setowner_name] = useState('');
    const [phone_number, setphone_number] = useState('');
    const [routing_number, setrouting_number] = useState('');
    const [account_number, setaccount_number] = useState('');
    const [showFields, setShowFields] = useState(false);

    const submitReview = () => {
        if (!ein) {
            alert("EIN field is required!");
            return;
        }

        // Directly make the Axios call without nesting inside useEffect
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_property_records`, {
            params: { ein }
        })
            .then(res => {
                if (res.data.length===0)
                {
                    alert("No Records or EIN doesn't exist");
                    resetForm();

                }
                setRecords(res.data);
            })
            .catch(err => {
                console.error("Error fetching approval property list:", err);
                alert("EIN or Property Name is Incorrect!, Please try again");
            });
        // Directly make the Axios call without nesting inside useEffect
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_owner_maintenance_details`, {
            params: { ein }
        })
            .then(res => {
                setMaintenancerecords(res.data);
            })
            .catch(err => {
                console.error("Error fetching approval property list:", err);
                alert("EIN or Property Name is Incorrect!, Please try again");
            });
    };
    const toggleFields = () => {
        setShowFields(!showFields);
    };
    const resetForm = () => {
        setEin('');
    };
    const resetTranscationForm = () => {
        setowner_name('');
        setaccount_number('');
        setrouting_number('');
        setphone_number('');
    };
    const update_maintenance_status = (id,ein,house_number,status) => {
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/update_maintenance_status`, {
            // id, EIN, HOUSE_NUMBER, STATUS
            id : id,
            ein :ein,
            house_number :house_number,
            status:status
        })
            .then(response => {
                alert('Maintenance Status Updated Successfully');
            })
            .catch(error => {
                alert("Unable to Update Maintenance Status, please try again");
            });
    };
    const addTransactionDetails = () => {
        const selectedEIN = records[0].EIN;
        console.log(selectedEIN);
        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/add_transcation_details`, {
            // EIN, HOUSE_NUMBER, SSN, FIRST_NAME
            owner_name: owner_name,
            ein :selectedEIN,
            phone_number :phone_number,
            routing_number:routing_number,
            account_number:account_number
        })
            .then(response => {
                alert('Transcation Details Updated Successfully');
                resetTranscationForm();
            })
            .catch(error => {
                alert("Unable to update Transcation Details, Please try again..");
                resetTranscationForm();
            });
    };

    return (
        <div>
            <center>
                <h2>Property Owner Login</h2>
                <br></br>
            </center>
            <div className="property_form">

                <label htmlFor="ein">EIN</label>
                <input type="text" id="ein" value={ein} onChange={e => setEin(e.target.value)} />
                <button onClick={submitReview}>Submit</button>
            </div>
            {records.length > 0 &&

            <div className={"print_records"}>
                <button onClick={toggleFields}>Add Transaction Details</button>

                {showFields && (
                    <div>
                        <input type="text" placeholder="Owner Name" value={owner_name} onChange={e => setowner_name(e.target.value)} />
                        <input type="text" placeholder="Phone Number" value={phone_number} onChange={e => setphone_number(e.target.value)} />
                        <input type="text" placeholder="Routing Number" value={routing_number} onChange={e => setrouting_number(e.target.value)} />
                        <input type="text" placeholder="Account Number" value={account_number} onChange={e => setaccount_number(e.target.value)} />
                        <button onClick={addTransactionDetails}>Submit</button>
                    </div>
                )}
                <table>
                    <thead>
                    <tr>
                        <th>EIN</th>
                        <th>HOUSE_TYPE</th>
                        <th>HOUSE_NUMBER</th>
                        <th>RENTAL_STATUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((r, i) => (
                        <tr key={i}>
                            <td>{r.EIN}</td>
                            <td>{r.HOUSE_TYPE}</td>
                            <td>{r.HOUSE_NUMBER}</td>
                            <td>{r.RENTAL_STATUS}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <br></br>
                <hr></hr>
                {maintenance_records.length > 0 &&
                    <div>
                        <center>
                            <h2> Maintenance Submitted Requests </h2>
                        </center>
                <table>
                    <thead>
                    <tr>
                        <th>EIN</th>
                        <th>HOUSE_NUMBER</th>
                        <th>ADDRESS</th>
                        <th>STATUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {maintenance_records.map((r, i) => (
                        <tr key={i}>
                            <td>{r.EIN}</td>
                            <td>{r.HOUSE_NUMBER}</td>
                            <td>{r.ADDRESS}</td>
                            <td>{r.STATUS}</td>
                            <td>
                                <button onClick={() => update_maintenance_status(r.id,r.EIN,  r.HOUSE_NUMBER, 'IN_PROGRESS')}>InProgress</button>
                            </td>
                            <td>
                                <button onClick={() => update_maintenance_status(r.id,r.EIN,  r.HOUSE_NUMBER, 'COMPLETED')}>Completed</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                    </div>
                }
            </div>
            }
        </div>
    );
}

export default Property_Admin;
