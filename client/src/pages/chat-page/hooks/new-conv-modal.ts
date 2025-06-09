import { useAuth } from "@/hooks";
import { createConversation } from "@/services/chat"
import { User } from "@/services/types"
import { browse } from "@/services/users";
import { useState } from "react";
import { useConversationScroller } from "./useConversationScroller";

export const useNewConvModal = () => {
    const [users, setUsers] = useState<User[]>([]);
    const userId = useAuth().getUser()?.user?.id;

    const { reload } = useConversationScroller();

    const onCreate = async (users: User[], name?: string, description?: string) => {
        const userIds = users.map((user) => user.id);
        await createConversation(userIds, name, description);
        reload();
    }

    const onSearchUsers = (text: string) => {
        browse({ pagination: { fromItem: 0, pageSize: 5 }, text }).then((users) => {
            setUsers(users.result.filter(user => user.id !== userId));
        })
    }

    return { onCreate, onSearchUsers, users }
}