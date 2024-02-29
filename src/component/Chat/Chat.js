import React, { useEffect, useState } from 'react';
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });
        socket.on('connect', () => {
            setId(socket.id);
        });

        // Join the room on component mount
        socket.emit('join-room', { room: window.room });

        socket.on('welcome', (data) => {
            setMessages([...messages, data]);
        });

        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
        });

        socket.on('leave', (data) => {
            setMessages([...messages, data]);
        });

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, []);

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages([...messages, data]);
        });
    
        return () => {
            socket.off('sendMessage');
        };
    }, [messages]);

    const send = () => {
        const message = document.getElementById('chatInput').value;
        socket.emit('message', { message, room: window.room }); // Send message to the specified room
        document.getElementById('chatInput').value = "";
    }

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>CHATJAM</h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => <Message user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'right' : 'left'} />)}
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input onKeyDown={(event) => (event.key === 'Enter' ? send() : null)} type="text" id="chatInput" />
                    <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
                </div>
            </div>
        </div>
    );
}

export default Chat;