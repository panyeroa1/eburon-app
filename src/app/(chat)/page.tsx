"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import UsernameForm from "@/components/username-form";
import { generateUUID } from "@/lib/utils";
import React, { useEffect } from "react";
import useChatStore from "../hooks/useChatStore";
import useAuthStore from "../hooks/useAuthStore";

export default function Home() {
  const id = generateUUID();
  const [open, setOpen] = React.useState(false);
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);
  const createNewChat = useChatStore((state) => state.createNewChat);
  const { isAuthenticated, user } = useAuthStore();

  const onOpenChange = (isOpen: boolean) => {
    if (userName || isAuthenticated) return setOpen(isOpen);

    setUserName("Anonymous");
    setOpen(isOpen);
  };

  // Create a new chat for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      createNewChat();
    }
  }, [isAuthenticated, createNewChat]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ChatLayout
          key={id}
          id={id}
          initialMessages={[]}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
        />
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Ollama!</DialogTitle>
            <DialogDescription>
              Enter your name to get started. This is just to personalize your
              experience.
            </DialogDescription>
            <UsernameForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
