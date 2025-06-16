import React, { useEffect } from 'react';
import { useChatContext } from "../chat-page-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { User } from "@/services/types";
import { useDebounce } from '@/hooks';

export const NewDirectConversationDialog: React.FC = () => {
  const { onCreate, onSearchUsers, users } = useChatContext().newConvDialogContext;
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>("");

  useEffect(() => {
    onSearchUsers('');
  }, [])

  const {debouncedCallback} = useDebounce(onSearchUsers, 500);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1 rounded-full">
          <MessageSquare />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              debouncedCallback(value);
            }}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user: User) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    onCreate([user]);
                    setOpen(false);
                  }}
                >
                  <Avatar className="mr-2">
                    <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.fullName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
