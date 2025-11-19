"use client"
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent } from "react";

export default function Auth() {
    const [userID, setUserID] = useState<string>("")
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000/auth&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671`
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const user = searchParams.get('user');

    const handleClick = async () => {
        localStorage.setItem("userID", userID);
        window.location.href = url;
    }
    
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        setUserID(event.target.value)
    }

    useEffect(() => {
        const user = localStorage.getItem("userID")
        if (!code || !user) {
            return
        }
        const getToken = async () => {
            await axios.post('http://localhost:8080/authenticate_token', {code: code, userID: user})
        }

        getToken()
     
    },[code])
    return (
        <div>
            <input onChange= {handleInput} value={userID} type="text" placeholder="Enter username here" />
            {userID != "" && (
            <button onClick ={handleClick}>Authenticate Here</button>
            )}
        </div>
    )
}