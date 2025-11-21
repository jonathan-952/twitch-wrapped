import axios from "axios"

export default async function Clips() {
    const res = await axios.get("http://localhost:8080/get_clips", { withCredentials: true })

    
    return (
        <p>hi</p>
    )
}