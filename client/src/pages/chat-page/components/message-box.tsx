import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MessageType } from '@/data-types/general';

interface MessageBoxProps {
  message: MessageType;
}

export function MessageBox({ message }: MessageBoxProps) {
  return (
    <div
      className={`w-full flex my-2 items-start ${
        message?.isSelf ? 'flex-row-reverse space-x-reverse' : 'justify-start'
      }`}
    >
      {/* Avatar */}
      <Avatar>
        <AvatarImage src={message?.createdBy?.profilePictureUrl} alt={message?.createdBy?.fullName} />
        <AvatarFallback>{message?.createdBy?.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className="max-w-[75%]">
        <div className="text-xs text-muted-foreground mb-1 text-right">
          {message?.createdBy?.fullName} · {new Date(message?.createdAt).toLocaleTimeString()}
        </div>
        <Card
          className={`${
            message?.isSelf ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <CardContent className="p-2">
            {message?.text}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
