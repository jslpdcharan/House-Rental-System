import React, {useEffect, useState} from "react";
import Axios from "axios";

export default function Property_View() {
    const [records, setRecords] = useState([]);
    const [rental_records, setRentalrecords] = useState([]);

    useEffect(() => {
        fetchrentalinformation();
        console.log(records.data);
    });

    const fetchrentalinformation = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_rental_availability_count`, {})
            .then(response => {
                setRentalrecords(response.data);
            })
            .catch(error => {
                console.error("Error fetching Properties List .. ", error);
                alert("Failed to fetch Properties list. Please try again later.");
            })
    };
    return (
        <div className={"print_records"}>
            <br></br>
            <center>
                <h2>Properties Available to Lease in Rental Database</h2>
            </center>

            <table>
                <thead>
                <tr>
                    <th>PROPERTY_NAME</th>
                    <br></br>
                    <th>AVAILABLE_TO_LEASE</th>
                </tr>
                </thead>
                <tbody>
                {rental_records.map((r, i) => (
                    <tr key={i}>
                        <td>{r.PROPERTY_NAME}</td>
                        <br></br>
                        <td>{r.property_name_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}