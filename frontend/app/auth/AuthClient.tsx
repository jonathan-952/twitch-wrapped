"use client"

import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, ChangeEvent } from "react"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"

export default function Auth() {
  const [userID, setUserID] = useState<string>("")

  const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671`
  console.log("CLIENT_ID:", process.env.NEXT_PUBLIC_CLIENT_ID)
  console.log("REDIRECT_URI:", process.env.NEXT_PUBLIC_REDIRECT_URI)
  console.log("AUTH URL:", url)

  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get("code")

  const handleClick = async () => {
    localStorage.setItem("userID", userID)
    router.push(url)
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserID(event.target.value)
  }

  useEffect(() => {
    const user = localStorage.getItem("userID")
    if (!code || !user) return

    const getToken = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTHENTICATE_URL}`,
          { code: code, userID: user },
          { withCredentials: true }
        )
        router.push("/")
      } catch (err) {
        console.error(err)
      }
    }

    getToken()
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6" />
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Clip Catchup
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Never miss trending clips from your favorite streamers
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          {/* Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  Connect Your Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  Securely link your Twitch account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">
                  2
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  View Your Followed Streamers
                </h3>
                <p className="text-sm text-muted-foreground">
                  See clips from channels you follow
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">
                  3
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  Catch Up on Clips
                </h3>
                <p className="text-sm text-muted-foreground">
                  Filter by date range and popularity
                </p>
              </div>
            </div>
          </div>

          {/* Input + Button */}
          <div className="space-y-6">
            <input
              type="text"
              id="my-input"
              value={userID}
              onChange={handleInput}
              placeholder="Twitch username"
              className="
                w-full
                h-10
                px-4
                text-md
                text-center
                rounded-md
                border
                border-border
                bg-background
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                transition
              "
            />

            <Button
              onClick={handleClick}
              disabled={!userID}
              className="
                w-full
                h-12
                text-base
                font-semibold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Connect with Twitch
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            We only access your followed channels and public clips
          </p>
        </div>
      </div>
    </div>
  )
}
