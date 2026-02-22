'use client'

import ChatroomPage from "@/pages/ChatroomPage";
import { checkAuth } from "@/services/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Chatroom() {
    const router = useRouter();

    useEffect(() => {
        if(!checkAuth()) router.push("/");
    })
    return <ChatroomPage/>
}