import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatContext } from "../chat-page-context";
import { useAuth } from "@/hooks";

export const ChatViewHeader = () => {
    const { conversationData } = useChatContext().chatViewContext;
    const userid = useAuth().getUser()?.user?.id;
    const otherNames = conversationData?.participants.filter(u => u.fullName !== conversationData.title && u.id !== userid).map(u => u.fullName).join(', ');
    return (
        <div className="flex items-center p-4 border-b">
            <Avatar className="mr-4">
                <AvatarImage src={conversationData?.id} alt={conversationData?.title} />
                <AvatarFallback>{conversationData?.title[0]}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold">{conversationData?.title}</h2>
                <p className="text-xs text-muted-foreground">{otherNames}</p>
            </div>
        </div>
    );
}