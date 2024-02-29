import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Join.css";

const Join = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const sendUser = () => {
        // Not sure why you need these global variables, 
        // but let's continue with your approach
        window.user = name;
        window.room = room;
        // Clear the input fields after saving the values
        setName("");
        setRoom("");
    }

    // Pass the room as a parameter to joinRoom
    const joinRoom = (roomId) => {
        // Here you would emit the event to join the room using socket.io
        console.log(`Joining room ${roomId} as ${name}`);
    }

    return (
        <div className="JoinPage">
            <div className="JoinContainer">
                <h1>CHATJAM</h1>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} // bind input value to name state
                    placeholder="Enter Your Name" 
                    type="text" 
                    id="joinInput" 
                />
                <input 
                    onChange={(e) => setRoom(e.target.value)} 
                    value={room} // bind input value to room state
                    placeholder="Enter Room ID" 
                    type="string" 
                    id="joinRoom" 
                />
                {/* Pass room ID to joinRoom when the button is clicked */}
                <Link onClick={(event) => (!name || !room) ? event.preventDefault() : joinRoom(room)} to="/chat">
                    <button onClick={sendUser} className="joinbtn">Join Room</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;
