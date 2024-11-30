import Axios from "axios";
import app from "react-scripts/template-typescript/src/App";


app.post("/api/update_approval_status_list", (req, res) => {
    const ein = req.body.ein;
    const house_number = req.body.house_number;
    const property_name = req.body.property_name;
    const status = req.body.status;

    const sql_query = "UPDATE rental_system.approve_property SET APPROVAL_STATUS = ? WHERE EIN=? AND HOUSE_NUMBER=? AND PROPERTY_NAME=?;";

    const values = [status, ein, house_number, property_name];
    const debugQuery = sql_query.replace(/\?/g, () => `'${values.shift()}'`);
    console.log(debugQuery);

    db.query(sql_query, values, (err, result) => {
        if(err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(null);
        }
    });
});


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



app.get('/api/get_approval_records', (req, res) => {
    const ein = req.query.ein; // Use req.query for GET request
    const sql = "SELECT EIN, OWNER_NAME, PROPERTY_NAME, HOUSE_NUMBER, APPROVAL_STATUS FROM rental_system.approve_property WHERE EIN = (?);";
    db.query(sql, [ein], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

app.get('/api/get_rent_availability', (req, res) => {
    const ein = req.query.ein; // Use req.query for GET request
    const sql = "SELECT r.EIN, r.HOUSE_TYPE, r.HOUSE_NUMBER, r.PROPERTY_NAME, r.ADDRESS, o.EMAIL_ID, o.PHONE_NUMBER FROM rental_system.rental_information r INNER JOIN rental_system.owner_info o ON r.EIN = o.EIN WHERE r.RENTAL_STATUS!='LEASED' ;";
    db.query(sql, [ein], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

app.get('/api/get_customer_rental_information', (req, res) => {
    const { ssn} = req.body;
    const sql = "select HOUSE_NUMBER, PROPERTY_NAME, HOUSE_TYPE,ADDRESS, RENTAL_STATUS FROM rental_system.rental_information where ssn=?;";
    db.query(sql,[ssn], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});