"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import useChatStore from "@/app/hooks/useChatStore";
import useAuthStore from "@/app/hooks/useAuthStore";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [chatNotFound, setChatNotFound] = useState(false);

  const getChatById = useChatStore((state) => state.getChatById);
  const addChat = useChatStore((state) => state.addChat);
  const { token } = useAuthStore();
  
  const chat = getChatById(id);

  useEffect(() => {
    const fetchChatFromAPI = async () => {
      if (chat || !token || isLoading || chatNotFound) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chats/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setChatNotFound(true);
            return;
          }
          throw new Error('Failed to fetch chat');
        }

        const { chat: fetchedChat } = await response.json();
        addChat(fetchedChat.id, {
          messages: fetchedChat.messages || [],
          createdAt: fetchedChat.createdAt,
          title: fetchedChat.title,
        });
      } catch (error) {
        console.error('Error fetching chat:', error);
        setChatNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatFromAPI();
  }, [id, chat, token, isLoading, chatNotFound, addChat]);

  if (chatNotFound) {
    return notFound();
  }

  if (isLoading || !chat) {
    return (
      <main className="flex h-[calc(100dvh)] flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center  ">
      <ChatLayout
        key={id}
        id={id}
        initialMessages={chat.messages}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
