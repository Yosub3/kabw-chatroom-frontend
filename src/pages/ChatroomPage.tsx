'use client'

import { ModalProps } from "@/interfaces/IModal";
import { logout } from "@/services/auth";
import { createMessage, getMessages } from "@/services/messages";
import MessageBubble from "@/ui/MessageBubble";
import Modal from "@/ui/Modal";
import getTokenHeader from "@/utils/getTokenHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const socket = io("http://localhost:5001");

const ChatroomPage = () => {
    const [search, setSearch] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [modal, setModal] = useState<ModalProps | null>(null);
    const [typedMessage, setTypedMessage] = useState("");
    const router = useRouter();

    const loadMessages = async () => {
        try {
            const res = await getMessages({page: page, limit: limit, search: search, headers: getTokenHeader()});
            setMessages(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            if(error instanceof Error){
                console.error({message: error.message, type: "danger"});
            } else {
                console.error({message: "Unknown error", type: "danger"});
            }
        }
    };

    useEffect(() => {
        loadMessages();
    }, [page, search, limit]);

    useEffect(() => {
        const handleMessage = (data: any) => {
            console.log("Pesan baru masuk:", data);
            setMessages((prev) => [...prev, data]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, []);
    
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!typedMessage.trim()) return;
        try {
            const res = (await createMessage(typedMessage, getTokenHeader())).data;
            socket.emit("message", res);
            setMessages((prev) => [...prev, res]);
            setTypedMessage("");
        } catch (error) {
            if(error instanceof Error){    
                setModal({
                    type: "danger",
                    message: error.message,
                    onOk: () => setModal(null)
                });
            }
        }
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    return(
        <div className='h-screen flex justify-center items-center bg-gray-100 px-4 py-12'>
            <div onClick={handleLogout} className="absolute border border-box border-red-500 bg-red-200 hover:cursor-pointer hover:bg-red-300 top-3 font-semibold rounded-md text-neutral-800">LOG OUT</div>
            <div className='flex flex-col w-full border border-box justify-between h-full max-w-7xl p-6 bg-white shadow-2xl rounded-2xl overflow-hidden'>
                <div className="border border-box overflow-y-auto flex flex-col gap-2 flex-1 px-4">{messages && (messages.map((message, index) => (
                    <MessageBubble message={message.message} userId={message.user_id} key={index}/>
                )))}
                </div>
                <div className="">
                    <form 
                        className='flex flex-row w-full mt-1 pl-4 pr-2 py-2 border border-gray-500 rounded-md'
                        onSubmit={handleSubmit}
                    >
                        <input type="text" 
                            id='name'
                            autoComplete="off"
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            className=" focus:outline-none flex-1"
                        />
                        <button className="flex items-center justify-center hover:cursor-pointer" type="submit">
                            <AiOutlineSend size={20}/>
                        </button>
                    </form>
                </div>
            </div>
            {modal && (
                <Modal
                    type={modal.type}
                    message={modal.message}
                    onOk={modal.onOk}
                />
            )}
        </div>
    )
}

export default ChatroomPage;