import React, { useState } from "react";
import Axios from 'axios';

function Request_Form() {
    const [ein, setEin] = useState('');
    const [records, setRecords] = useState([]);

    const submitReview = () => {
        if (!ein) {
            alert("EIN field is required!");
            return;
        }

        // Directly make the Axios call without nesting inside useEffect
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_approval_records`, {
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
    };
    const resetForm = () => {
        setEin('');
    };

    return (
        <div>
            <center>
                <h2>Check Property Approval Status</h2>
                <br></br>
            </center>
            <div className="property_form">

                <label htmlFor="ein">EIN</label>
                <input type="text" id="ein" value={ein} onChange={e => setEin(e.target.value)} />
                <button onClick={submitReview}>Submit</button>
            </div>
            <div className={"print_records"}>
                <table>
                    <thead>
                    <tr>
                        <th>EIN</th>
                        <th>OWNER_NAME</th>
                        <th>PROPERTY_NAME</th>
                        <th>HOUSE_NUMBER</th>
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
                            <td>{r.APPROVAL_STATUS}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Request_Form;
