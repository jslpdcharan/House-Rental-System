const express = require('express');
const app = express();
const cors =require("cors");
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const { OpenAI } = require('openai');
const http = require('http');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
require('dotenv').config();
// database credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Vineeth@2002",
    database: "rental_system",
});
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
require('dotenv').config();

let worksheets = {}; // Temporary in-memory storage for worksheet data
const userThreads = {}; // Temporary in-memory storage to track threads by username

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure to add your OpenAI API key in your .env file
});
const ASSISTANT_ID = process.env.ASSISTANT_ID;

// To upload the request to list property in the website
app.post("/api/update_approval_property_list",(req,res) =>{
    const owner_name = req.body.owner_name;
    const ein = req.body.ein;
    const email_id = req.body.email_id;
    const house_type = req.body.house_type;
    const phone_number = req.body.phone_number;
    const house_number = req.body.house_number;
    const address = req.body.address;
    const property_name = req.body.property_name;
    const stored_proc = "CALL rental_system.UPDATE_APPROVAL_PROPERTY_LIST(?,?,?,?,?,?,?,?);";

    db.query(stored_proc, [owner_name, ein, email_id, phone_number, house_type, house_number, address, property_name], (err, result) => {
        if(err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(null);
        }
    });
});


// To fetch the approval status for the property based on the EIN (requests_page)
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

// Admin page submitted records
app.get('/api/get_submitted_records', (req, res) => {
    const sql = "SELECT EIN, OWNER_NAME, PROPERTY_NAME, HOUSE_NUMBER, ADDRESS, EMAIL_ID, PHONE_NUMBER, HOUSE_TYPE, APPROVAL_STATUS FROM rental_system.approve_property WHERE APPROVAL_STATUS NOT IN ('APPROVED','REJECTED');";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// Admin page username and password authentication
app.post('/api/admin_login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM rental_system.admin_users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: 'An error occurred. Please try again later.' });
        }

        if (result && result.length > 0) {
            return res.send({ success: true });
        } else {
            return res.send({ success: false });
        }
    });
});


// To update the record status in the property for the admin page
app.post("/api/update_approval_status_list",(req,res) =>{
    const ein = req.body.ein;
    const house_number = req.body.house_number;
    const property_name = req.body.property_name;
    const status = req.body.status;
    const stored_proc = "CALL rental_system.UPDATE_APPROVAL_STATUS(?,?,?,?);";
    const values = [status, ein, property_name,house_number];
    db.query(stored_proc, values, (err, result) => {
        if(err) {
            console.log("Error");
            res.status(500).send({ error: err.message });
        } else {
            console.log("No Error");
            res.send(null);
        }
    });
});

// To validate the user in the database
app.post('/api/customer_login', (req, res) => {
    const { ssn, phone } = req.body;

    const sql = "SELECT * FROM rental_system.personal_information WHERE SSN = ? AND PHONE_NUMBER = ?";

    db.query(sql, [ssn, phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: 'An error occurred. Please try again later.' });
        }

        if (result && result.length > 0) {
            return res.send({ success: true });
        } else {
            return res.send({ success: false });
        }
    });
});

// To update customer data in the table
app.post("/api/update_customer_records",(req,res) =>{
    const {first_name, last_name, phone, email_id, occupation, annual_income, dob, ssn} =req.body;
    const customer_values = [first_name, last_name,  email_id,phone, occupation, annual_income, ssn,dob];
    const stored_proc = "CALL rental_system.ADD_CUSTOMER_INFORMATION(?,?,?,?,?,?,?,?);";
    db.query(stored_proc, customer_values, (err, result) => {
        if(err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(null);
        }
    });
});

// fetch records from the database that will display the properties that is not leased
app.get('/api/get_rent_availability', (req, res) => {
    const sql = "SELECT r.RENTAL_ID,r.EIN, r.HOUSE_TYPE, r.HOUSE_NUMBER, r.PROPERTY_NAME, r.ADDRESS, o.EMAIL_ID, o.PHONE_NUMBER FROM rental_system.rental_information r INNER JOIN rental_system.owner_info o ON r.EIN = o.EIN WHERE r.RENTAL_STATUS!='LEASED' ;";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// fetch the customer records that he has leased
app.get('/api/get_customer_rental_information', (req, res) => {
    const ssn = req.query.ssn;
    const sql = "select HOUSE_NUMBER, PROPERTY_NAME, HOUSE_TYPE,ADDRESS, RENTAL_STATUS,EIN FROM rental_system.rental_information where SSN=?;";
    db.query(sql,[ssn], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// Update the lease status in the table
app.post("/api/update_lease_status",(req,res) =>{
    const { house_number, ssn, first_name,status,id} =req.body;
    const ein =parseInt(req.body.ein);
    const stored_proc = "CALL rental_system.UPDATE_LEASE_PROPERTY(?,?,?,?,?,?);";
    const values = [ house_number,status,ssn,first_name,id,ein];
    db.query(stored_proc, values, (err, result) => {
        if(err) {
            console.log("Error",err);
            res.status(500).send({ error: err.message });
        } else {
            console.log(err);
            res.send(null);
        }
    });
});

// Add the maintenance records into the table
app.post("/api/add_maintenance_record",(req,res) =>{
    const { ein,house_number,address,status,ssn} =req.body;
    const values = [ ein,ssn,house_number,address,status];
    const insert_sql = "INSERT INTO rental_system.maintenance_details(EIN,SSN,HOUSE_NUMBER,ADDRESS,STATUS) VALUES(?,?,?,?,?);";

    db.query(insert_sql, values, (err, result) => {
        if(err) {
            console.log("Error",err);
            res.status(500).send({ error: err.message });
        } else {
            console.log(err);
            res.send(null);
        }
    });
});

// Get the rental availabilities count in the Home Page
app.get('/api/get_rental_availability_count', (req, res) => {
    const sql = "select  PROPERTY_NAME,property_name_count FROM rental_system.vacant_properties_count;";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// To fetch the properties status for the property owner (Property Admin)
app.get('/api/get_property_records', (req, res) => {
    const ein = req.query.ein; // Use req.query for GET request
    const sql = "SELECT EIN, HOUSE_TYPE, HOUSE_NUMBER, RENTAL_STATUS FROM rental_system.rental_information WHERE EIN = (?);";
    db.query(sql, [ein], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// Add the Transcation Details of the property owner
app.post("/api/add_transcation_details",(req,res) =>{
    const { owner_name,ein,phone_number,routing_number,account_number} =req.body;
    const values = [ owner_name,ein,phone_number,routing_number,account_number];
    const insert_sql = "INSERT INTO rental_system.transcation_details(OWNER_NAME,EIN,PHONE_NUMBER,ROUTING_NUMBER,ACCOUNT_NUMBER) VALUES(?,?,?,?,?);";

    db.query(insert_sql, values, (err, result) => {
        if(err) {
            console.log("Error",err);
            res.status(500).send({ error: err.message });
        } else {
            console.log(err);
            res.send(null);
        }
    });
});

// To fetch the maintenance records for the property owners (Property Admin)
app.get('/api/get_owner_maintenance_details', (req, res) => {
    const ein = req.query.ein; // Use req.query for GET request
    const sql = "SELECT id,EIN, HOUSE_NUMBER, ADDRESS, STATUS from rental_system.maintenance_details WHERE EIN = (?) AND STATUS IN ('SUBMITTED','IN_PROGRESS');";
    db.query(sql, [ein], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(result);
        }
    });
});

// Update the Maintenance Status (Property Admin Page)
app.post("/api/update_maintenance_status",(req,res) =>{
    const id =parseInt(req.body.id);
    const ein = req.body.ein;
    const house_number =req.body.house_number;
    const status =req.body.status;
    const update_sql = "UPDATE rental_system.maintenance_details SET status = (?) WHERE house_number = (?) AND ein = (?) AND id=(?);";
    const values = [status, house_number,ein,id];
    db.query(update_sql, values, (err, result) => {
        if(err) {
            console.log(err);
            console.log("Error");
            res.status(500).send({ error: err.message });
        } else {
            console.log("No Error");
            res.send(null);
        }
    });
});

// update lease vacant status
app.post("/api/update_vacant_status",(req,res) =>{
    const { status,house_number,ssn} =req.body;
    const values = [ status,house_number,ssn];
    const insert_sql = "UPDATE rental_system.rental_information SET RENTAL_STATUS=(?), SSN='',FIRST_NAME='' WHERE HOUSE_NUMBER=(?) AND SSN =(?);";

    db.query(insert_sql, values, (err, result) => {
        if(err) {
            console.log("Error",err);
            res.status(500).send({ error: err.message });
        } else {
            console.log(err);
            res.send(null);
        }
    });
});

app.post('/api/chatgpt', async (req, res) => {
    console.log('Assistant Function Called...');
    const username = "guest_user"; // Constant username
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        let threadId;

        // Check if the constant user already has a thread
        if (userThreads[username]) {
            threadId = userThreads[username];
            console.log('Reused the old thread...');
        } else {
            // Create a new thread for the constant user if none exists
            console.log('Created new thread...');
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
            userThreads[username] = threadId;
        }
        console.log(`Thread ID: ${threadId}`);

        // Send the user's message to the assistant
        await openai.beta.threads.messages.create(
            threadId,
            { role: "user", content: message }
        );

        // Run the assistant on the user's thread
        const run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: ASSISTANT_ID }
        );

        // Poll the assistant's status until the run is completed
        let runStatus;
        do {
            runStatus = await openai.beta.threads.runs.retrieve(
                threadId,
                run.id
            );
            if (runStatus.status === "failed") {
                return res.status(500).json({ error: "Assistant run failed" });
            }
            if (runStatus.status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } while (runStatus.status !== "completed");

        // Retrieve the assistant's response
        const messages = await openai.beta.threads.messages.list(threadId);

        let assistantResponse = 'Sorry, I did not understand that.';
        for (const message of messages.data) {
            if (message.role === 'assistant') {
                for (const content of message.content) {
                    if (content.type === 'text') {
                        assistantResponse = content.text.value;
                        break;
                    }
                }
                break;
            }
        }

        // Send the response back to the frontend
        res.json({ content: assistantResponse });

    } catch (error) {
        console.error("Error in /api/assistant/message:", error);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});
app.listen(3001,() =>
{
    console.log("Running on the port 3001")
});
