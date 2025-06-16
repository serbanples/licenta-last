import { useLoading, useSearch, useToast } from "@/hooks";
import { getConversations } from "@/services/chat";
import { Pagination } from "@/services/types";
import { useEffect, useState } from "react";
import { ConversationType } from '../../../data-types/general';
import { useSearchParams } from "react-router-dom";
import _ from "lodash";

const defaultPagination = { fromItem: 0, pageSize: 20 };

export const useConversationScroller = () => {
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const [pagination, setPagination] = useState<Pagination>(defaultPagination);
    const [id, setId] = useState<string>();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextFrom, setNextFrom] = useState(0);

    const [__, setSearchParams] = useSearchParams();

    const toast = useToast();
    const { setLoading } = useLoading();

    const { suggestTerm, clearSearch } = useSearch();

    const fetchConversations = (pagination: Pagination, text?: string, id?: string) => {
        setLoading(true);
        getConversations({ pagination, text, _id: id })
            .then((result) => {
                if (result.pagination.count < result.pagination.totalCount) setHasMore(true);
                else setHasMore(false);
                setNextFrom(result.pagination.perPage);
                console.log(result.result)
                setConversations(result.result);
                setLoading(false);
            })
            .catch((err) => { console.log(err); toast.generic(); setLoading(false) });
    }

    useEffect(() => {
        fetchConversations(pagination, suggestTerm, id);
    }, [suggestTerm, pagination, id])

    const fetchNext = () => {
        setPagination(prev => ({ ...prev, fromItem: nextFrom }))
    }

    const fetchById = (id: string) => {
        setId(id);
        setPagination(defaultPagination);
    }

    const clear = () => {
        clearSearch();
        setPagination(defaultPagination);
        setId(undefined);
    }

    const reload = () => {
        fetchConversations(pagination);
    }

    const onConversationSelect = (id: string) => {
        setSearchParams({ chat: id })
        updateUnread(id);
    }

    const updateUnread = (conversationId: string, unreadCount: number = 0) => {
        setConversations(prevConvs => {
            // this always creates a new array, even if nothing matches
            return prevConvs.map(conv =>
                conv.id === conversationId
                    ? { ...conv, unreadCount: unreadCount }
                    : conv
            );
        });
    };

    const refresh = () => {
        fetchConversations(defaultPagination);
    }

    return { conversations, fetchNext, fetchById, clear, hasMore, onConversationSelect, reload, updateUnread, refresh };
}