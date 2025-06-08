import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useNotifications } from "@/lib/notifications";
import { useState } from "react";

export const NotificationDropdown: React.FC = () => {
    const { notifications, clearNotifications, markAsSeen } = useNotifications();

    const [open, setOpen] = useState(false);

    // Trigger click and open state
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            markAsSeen();
        }
        setOpen(isOpen);
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-0 right-0"
                        >
                            {notifications.length}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="max-h-48 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                    ) : (
                        notifications.map(n => (
                            <DropdownMenuItem key={n.id}>
                                <div>
                                    <strong>{n.topic}</strong>
                                    <div>{String(n.data)}</div>
                                    {/* <small>{n.receivedAt.toLocaleTimeString()}</small> */}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {/* {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                ) : (
                    notifications.map((note) => (
                        <DropdownMenuItem key={note.id}>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{note.topic}</span>
                                <span className="text-xs text-muted-foreground">
                                    {String(note.data)}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    ))
                )} */}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={clearNotifications} className="text-destructive">
                            Clear All
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};