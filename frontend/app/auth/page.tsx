"use client"
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/button"

export default function Auth() {
    const [userID, setUserID] = useState<string>("")
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671`
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

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
            await axios.post('http://localhost:8080/authenticate_token', 
                {code: code, userID: user}, 
                { withCredentials: true }
            )
        }

        getToken()
     
    },[code])
    return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
          </div>
          <h1 className="text-4xl font-bold mb-3 text-foreground">Clip Catchup</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Never miss trending clips from your favorite streamers
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Connect Your Account</h3>
                <p className="text-sm text-muted-foreground">Securely link your Twitch account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">View Your Followed Streamers</h3>
                <p className="text-sm text-muted-foreground">See clips from channels you follow</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Catch Up on Clips</h3>
                <p className="text-sm text-muted-foreground">Filter by date range and popularity</p>
              </div>
            </div>
          </div>
            <input
                type="text"
                id="my-input"
                value={userID}
                onChange={handleInput}
                placeholder="Twitch Username..."
            />
            {userID != "" && (
                
                <Button onClick={handleClick} className="w-full h-12 text-base font-semibold">
              <>
                Connect with Twitch
              </>
                </Button>
            )}
          

          <p className="text-xs text-center text-muted-foreground mt-4">
            We'll only access your followed channels and public clips
          </p>
        </div>
      </div>
    </div>
  )
}