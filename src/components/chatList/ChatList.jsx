import { Link } from 'react-router-dom'
import './chat.css'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

    // Fetch data from your API
    const { isPending, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                credentials: 'include'
            }).then((res) => res.json())
    })

    return (
        <div className='chatList'>
            <span className='title'>
                DASHBOARD
            </span>
            <Link to="/dashboard" >Create a new Chat</Link>
            <Link to="/" >Explore AI Nexus</Link>
            <a href="https://amleshwar-p.vercel.app/" target="_blank" rel="noopener noreferrer">Contact</a>

            <hr />
            <span className='title'>Recent Chats</span>
            <div className='list'>
                {isPending
                    ? "Loading..."
                    : error
                        ? "Something went wrong."
                        : data?.map((chat) => (
                            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}> {chat.title || "Untitled Chat"}</Link>
                        ))}
            </div>
            <hr />
        </div>
    )
}

export default ChatList