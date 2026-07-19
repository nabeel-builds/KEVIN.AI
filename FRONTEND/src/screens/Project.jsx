import React, { useEffect, useState, useContext, useRef } from 'react'
import { data, useLocation } from 'react-router-dom'
import axios from '../config/axios.js'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'
import { UserContext } from '../context/user.context.jsx'
import { useNavigate } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'





const Project = () => {

    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectUserId, setSelectUserId] = useState([])
    const [users, setUsers] = useState([])
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = useRef()
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(`messages-${location.state.project._id}`)
        return saved ? JSON.parse(saved) : []
    })

    const navigate = useNavigate()


    const saveMessages = (newMessages) => {
        setMessages(newMessages)
        localStorage.setItem(`messages-${project._id}`, JSON.stringify(newMessages))
    }



    useEffect(() => {

  

        initializeSocket(project._id)

        receiveMessage('project-message', data => {


            setMessages(prev => {
                const updated = [...prev, data]
                localStorage.setItem(`messages-${project._id}`, JSON.stringify(updated))
                return updated
            })

        })



        const fetchProjectsById = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/get-project/${location.state.project._id}`)
           
                setProject(res.data.project)
            } catch (err) {
                console.log(err)
            }
        }
        fetchProjectsById()



        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`)
          
                setUsers(res.data.users)
            } catch (err) {
                console.log(err)
            }
        }

        fetchUsers()


    }, [project._id])


    function addCollaborators() {

        try {
            const res = axios.put(`${import.meta.env.VITE_API_URL}/projects/add-user`, {
                projectId: location.state.project._id,
                users: Array.from(selectUserId)
            })
            console.log(res.data)
            setIsModalOpen(false)
        } catch (err) {
            console.log(err)
        }



    }


    const handleUserClick = (id) => {
        setSelectUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id)
            } else {
                newSelectedUserId.add(id)
            }
            return newSelectedUserId
        })
    }



    const send = () => {



    

        if (!user) {
            console.log("User null hai - ruko")
            return
        }

        const messageData = {
            message,
            user: {
                _id: user._id,
                username: user.username
            }
        }

        sendMessage('project-message', messageData)
        saveMessages([...messages, messageData]) 


        setMessage('')

    }



    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }


    return (
        <main className='h-screen w-screen flex'>
            <section id='LEFT' className='flex flex-col h-screen min-w-screen bg-slate-300 relative'>
                <header id='header' className={`flex justify-between items-center p-2 h-20 px-4 w-full bg-slate-100 absolute z-10 top-0 ${isModalOpen ? "hidden" : "block"}`}>
                 
                    {/* RIGHT — Back button */}
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center bg-slate-300 px-3 py-1 rounded-md text-[15px] text-black cursor-pointer"
                    >
                       ‹ Back 
                    </button>

                    {/* CENTER — Add Collaborator */}
                    <button
                        className='flex gap-2 items-center'
                        onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill cursor-pointer"></i>
                        <p>Add Collaborator</p>
                    </button>

                      {/* LEFT — profile icon */}
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className='p-2 cursor-pointer'>
                        <i className="ri-group-fill text-xl"></i>
                    </button>

                    

                </header>

                <div className="conversation-area grow flex flex-col pt-20 pb-10 bg-slate-300 h-full relative">

                    <div
                        ref={messageBox}
                        id='message-box' className="grow flex flex-col gap-1 p-3 overflow-auto max-h-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.user?._id === 'ai' ? 'max-w-screen' : 'max-w-screen'} ${msg.user?._id == user?._id?.toString() && 'ml-auto max-w-screen'} message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.user?.username}</small>
                                <div className='text-sm'>
                                    {msg.user?._id === 'ai' ?
                                        <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2'>
                                            <Markdown
                                                options={{
                                                    overrides: {
                                                        code: {
                                                            component: ({ className, children }) => {
                                                                const language = className ? className.replace('lang-', '') : 'javascript'
                                                                return (
                                                                    <SyntaxHighlighter
                                                                        language={language}
                                                                        style={oneDark}
                                                                        customStyle={{ borderRadius: '8px', padding: '12px', fontSize: '13px' }}
                                                                    >
                                                                        {children}
                                                                    </SyntaxHighlighter>
                                                                )
                                                            }
                                                        }
                                                    }
                                                }}>{msg.message}</Markdown>
                                        </div>
                                        : msg.message}
                                </div>
                            </div>
                        ))}

                    </div>


                    <div id='input-field' className="w-full flex absolute bottom-0">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            placeholder='Enter message'
                            className='bg-white p-2 border-none outline-none grow'
                        />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white cursor-pointer'><i className="ri-send-ins-fill"></i></button>
                    </div>
                </div>

                <div id='side-panel' className={`w-full h-full py-9 flex flex-col gap-2 bg-slate-50 absolute left-[-100%] transition-all ${isSidePanelOpen ? "translate-x-0" : "translate-x-full"} top-0`}>

                    <header className='flex justify-between items-center p-2 px-3 bg-slate-200'>
                        <h1 className='font-semibold text-lg'>Collaborators</h1>
                        <button className='cursor-pointer'
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-2">


                        {project.users && project.users.map(user => {

                            return (
                                <div  className="users flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2">
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>

                                    <h1 className='font-semibold text-lg'>{user?.username || user}</h1>
                                    {project.createdBy?._id === user?._id && (
                                        <span className='text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-300 w-fit'>
                                            🛡️ Admin
                                        </span>
                                    )}

                                </div>
                            )


                        })}


                    </div>

                </div>

            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 cursor-pointer'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`users cursor-pointer hover:bg-slate-200 ${Array.from(selectUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user?.username || user}</h1>
                                    
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Project