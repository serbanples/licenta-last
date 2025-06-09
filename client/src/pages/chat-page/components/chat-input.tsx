import React from "react";
import { useChatContext } from "../chat-page-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ChatInput = () => {
    const { onSend } = useChatContext().chatViewContext;
    const [text, setText] = React.useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4 border-t">
            <Input
                placeholder="Type a message..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 mr-2"
            />
            <Button type="submit">Send</Button>
        </form>
    );
}