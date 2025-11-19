"use client"
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";

export default function Auth() {
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000/auth&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671`
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const handleClick = async () => {
        window.location.href = url;
    }

    useEffect(() => {
        if (!code) {
            return
        }
    
        const getToken = async () => {
            await axios.post('http://localhost:8080/authenticate_token', {code: code})
        }

        getToken()
     
    },[code])
    return (
        <div>
            <button onClick ={handleClick}>Authenticate Here</button>
        </div>
    )
}