import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/services/types";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useChatContext } from "../chat-page-context";

export const NewConversationDialog = () => {
    const { onCreate, onSearchUsers, users } = useChatContext().newConvDialogContext
    const [selected, setSelected] = React.useState<User[]>([]);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState<string>();

    useEffect(() => {
        onSearchUsers('');
      }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="p-1 rounded-full">
                            <Plus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Create group</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>Select at least 2 users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Participants</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selected.map(u => (
                                <Badge
                                    key={u.id}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => setSelected(sel => sel.filter(x => x.id !== u.id))}
                                >
                                    {u.fullName} ×
                                </Badge>
                            ))}
                        </div>
                        <Command>
                            <CommandInput
                                placeholder="Search users..."
                                value={searchValue}
                                onValueChange={(value) => { setSearchValue(value); onSearchUsers(value); }}
                            />
                            <CommandList>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                    {users.map(user => (
                                        <CommandItem
                                            key={user.id}
                                            onSelect={() => {
                                                setSelected(sel => [...sel, user]);
                                            }}
                                        >
                                            <Avatar className="mr-2">
                                                <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
                                                <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            {user.fullName}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                    <div>
                        <Label>Conversation Name (optional)</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Group name"
                        />
                    </div>
                    <div>
                        <Label>Description (optional)</Label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={selected.length < 2}
                        onClick={() => {
                            onCreate(selected, name, description);
                            setOpen(false);
                        }}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}