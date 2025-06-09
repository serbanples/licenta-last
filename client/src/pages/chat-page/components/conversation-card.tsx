import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ConversationType } from "@/data-types/general";

export const ConversationCard = ({
  conversation,
  onClick,
}: {
  conversation: ConversationType;
  onClick: () => void;
}) => {
  console.log(conversation);
  return (
    <Card onClick={onClick} className="cursor-pointer mb-2">
      <CardContent className="flex justify-between items-center">
        <div>
          <CardTitle className="text-sm">{conversation.title}</CardTitle>
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage?.text}
          </p>
        </div>
        {conversation.unreadCount > 0 && <Badge variant={'destructive'}>{conversation.unreadCount}</Badge>}
      </CardContent>
    </Card>
  );
}