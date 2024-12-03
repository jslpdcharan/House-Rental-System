import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../styles/PropertyView.css";

export default function Property_View() {
    const [records, setRecords] = useState([]);
    const [rental_records, setRentalrecords] = useState([]);
    const [chatVisible, setChatVisible] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [chatResponses, setChatResponses] = useState([
        { bot: "Hi, How can I help you today?" } // Default message
    ]);
    const [loading, setLoading] = useState(false);

    // Run fetchrentalinformation only once when the component mounts
    useEffect(() => {
        fetchrentalinformation();
    }, []); // Empty dependency array ensures this runs only once

    const fetchrentalinformation = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/get_rental_availability_count`, {})
            .then(response => {
                setRentalrecords(response.data);
            })
            .catch(error => {
                console.error("Error fetching Properties List .. ", error);
                alert("Failed to fetch Properties list. Please try again later.");
            });
    };

    const handleSendMessage = () => {
        if (userMessage.trim() === "") return;

        // Add user's message and show a loading indicator for bot response
        setChatResponses(prev => [...prev, { user: userMessage, bot: "Loading..." }]);
        setLoading(true);

        Axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/chatgpt`, {
            message: userMessage
        })
            .then(response => {
                console.log(response); // Debugging log to confirm API response structure
                const botResponse = response.data.content; // Accessing the `content` field
                console.log(botResponse); // Log the bot's response

                // Update the last "Loading..." message with the actual bot response
                setChatResponses(prev => {
                    const updatedResponses = [...prev];
                    updatedResponses[updatedResponses.length - 1].bot = botResponse; // Replace "Loading..." with actual response
                    return updatedResponses;
                });
                setLoading(false);
                setUserMessage(""); // Clear the input field
            })
            .catch(error => {
                console.error("Error sending message to ChatGPT", error);

                // Update the last "Loading..." message with an error message
                setChatResponses(prev => {
                    const updatedResponses = [...prev];
                    updatedResponses[updatedResponses.length - 1].bot = "Failed to fetch a response. Please try again.";
                    return updatedResponses;
                });
                setLoading(false);
            });
    };

    return (
        <div className={"property-view"}>
            <br />
            <center>
                <h2>Properties Available to Lease in Rental Database</h2>
            </center>

            <table>
                <thead>
                <tr>
                    <th>PROPERTY_NAME</th>
                    <th>AVAILABLE_TO_LEASE</th>
                </tr>
                </thead>
                <tbody>
                {rental_records.map((r, i) => (
                    <tr key={i}>
                        <td>{r.PROPERTY_NAME}</td>
                        <td>{r.property_name_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Chatbot Icon */}
            <div className="chatbot-icon" onClick={() => setChatVisible(!chatVisible)}>
                💬
            </div>

            {/* Chatbot Popup */}
            {chatVisible && (
                <div className="chatbot-popup">
                    <div className="chat-header">
                        <h4>Chat with Us</h4>
                        <button onClick={() => setChatVisible(false)}>✖</button>
                    </div>
                    <div className="chat-body">
                        {chatResponses.map((chat, index) => (
                            <div key={index}>
                                {chat.user && <p><strong>You:</strong> {chat.user}</p>}
                                {chat.bot && <p><strong>Bot:</strong> {chat.bot}</p>}
                            </div>
                        ))}
                        {loading && <p>Processing your message...</p>}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button onClick={handleSendMessage} disabled={loading}>
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
