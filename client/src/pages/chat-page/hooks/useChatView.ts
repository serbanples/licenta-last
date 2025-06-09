import { ConversationType, MessageType } from "@/data-types/general";
import { useLoading, useToast } from "@/hooks";
import { getConversations, getMessages } from "@/services/chat";
import { Pagination } from "@/services/types";
import { WS_SERVER_URL } from "@/services/urls";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from 'socket.io-client';

const DEFAULT_PAGINATION: Pagination = { fromItem: 0, pageSize: 40, orderBy: 'createdAt', orderDir: 'desc' };

export const useChatView = () => {
    const [searchParams, __] = useSearchParams();
    const conversationId = searchParams.get('chat');
    const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [conversationData, setConversationData] = useState<ConversationType>();

    const toast = useToast();

    // const userid = useAuth().getUser();

    const { setLoading } = useLoading();

    const socketRef = useRef<Socket | undefined>(undefined);

    useEffect(() => {
        if (!conversationId) return;
        console.log('id change')
        fetchMessagesForConv(conversationId, DEFAULT_PAGINATION, 'set');

        getConversationData(conversationId);

        const socket = io(WS_SERVER_URL, { withCredentials: true, transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-conversation', { conversationId });
            setLoading(true);
        });

        socket.on('joined-conversation', () => {
            setLoading(false);
        })

        socket.on('recieve-message', (message: MessageType) => {
            // computeSelf(message, userid?.user?.id)
            setMessages(prev => [message, ...prev]);
        })

        return () => {
            socket.emit("leave-conversation", { conversationId });
            socket.disconnect();
        };
    }, [conversationId]);

    const fetchMessagesForConv = async (convId: string, pagination: Pagination, type: 'set' | 'append') => {
        setMessageLoading(true);
        const messages = await getMessages(convId, pagination).catch(() => { toast.generic(); setMessageLoading(false) });
        console.log(messages)
        setMessageLoading(false);
        if(type === 'set') {
            setMessages(messages.result)
            console.log(messages.result)
        }else {
            setMessages(prev => [...prev, messages.result]);
        }
        setHasMore(messages.pagination.count < messages.pagination.totalCount);
        setPagination(prev => ({ ...prev, fromItem: pagination.fromItem! + pagination.pageSize! }))
    }

    const getConversationData = (conversationId: string) => {
        getConversations({ pagination: DEFAULT_PAGINATION, _id: conversationId }).then((conversation) => {
            if (conversation.result.length > 0) setConversationData(conversation.result[0]);
        })
    }

    const onSend = (text: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit('send-message', { conversationId, text })
    }

    const fetchNext = () => {
        fetchMessagesForConv(conversationId!, pagination, 'append')
    }

    return { messages, hasMore, messageLoading, fetchNext, conversationId, conversationData, onSend };

}