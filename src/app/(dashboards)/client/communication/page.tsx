"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Professor Utonium",
      lastMessage: "Hello! How are you?",
      messages: [
        { id: 1, text: "Hey there!", sender: "them", timestamp: "10:30 AM" },
        {
          id: 2,
          text: "Hello! How are you?",
          sender: "them",
          timestamp: "10:31 AM",
        },
        {
          id: 3,
          text: "I'm good, thanks!",
          sender: "you",
          timestamp: "10:32 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Work Team",
      lastMessage: "Meeting at 3 PM.",
      messages: [
        {
          id: 1,
          text: "Team meeting tomorrow",
          sender: "them",
          timestamp: "9:00 AM",
        },
        { id: 2, text: "What time?", sender: "you", timestamp: "9:05 AM" },
        {
          id: 3,
          text: "Meeting at 3 PM.",
          sender: "them",
          timestamp: "9:10 AM",
        },
      ],
    },
    {
      id: 3,
      name: "Tech Team",
      lastMessage: "Tomorrow is the tech meeting.",
      messages: [
        {
          id: 1,
          text: "What's for dinner?",
          sender: "them",
          timestamp: "6:00 PM",
        },
      ],
    },
  ]);

  const [activeConversation, setActiveConversation] = useState(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: Date.now(),
        text: newMessage,
        sender: "you",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Update the active conversation with the new message
      const updatedConversations = conversations.map((convo) => {
        if (convo.id === activeConversation.id) {
          return {
            ...convo,
            lastMessage: newMessage,
            messages: [...convo.messages, newMessageObj],
          };
        }
        return convo;
      });

      setConversations(updatedConversations);
      setActiveConversation(
        updatedConversations.find((c) => c.id === activeConversation.id) || activeConversation
      );
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter(
    (convo) =>
      convo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-80 bg-zinc-800 p-4 flex flex-col gap-4 border-r border-zinc-700">
        <h2 className="text-lg font-semibold">Conversations</h2>

        <Input
          placeholder="Search conversations..."
          className="mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {filteredConversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer hover:bg-zinc-700",
                  activeConversation?.id === convo.id ? "bg-zinc-700" : ""
                )}
                onClick={() => setActiveConversation(convo)}
              >
                <div className="font-medium">{convo.name}</div>
                <div className="text-sm text-zinc-200 truncate">
                  {convo.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button className="bg-pink-700 hover:bg-pink-800 mt-auto">
          New Conversation
        </Button>
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <header className="bg-zinc-800 p-4 flex items-center border-b border-zinc-700">
              <div className="font-semibold">{activeConversation.name}</div>
            </header>

            <main className="p-6 flex-1 flex flex-col">
              <Card className="p-4 flex-1 flex flex-col bg-zinc-900 border-zinc-700">
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-3">
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "p-3 rounded-lg max-w-xs",
                          msg.sender === "you"
                            ? "bg-pink-700 ml-auto text-white"
                            : "bg-zinc-700 mr-auto"
                        )}
                      >
                        <p>{msg.text}</p>
                        <span className="text-xs opacity-75 block text-right mt-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2 text-white">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-pink-700 hover:bg-pink-800"
                  >
                    Send
                  </Button>
                </div>
              </Card>
            </main>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-200">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
