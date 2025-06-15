import { Action } from "@/components/types";
import { LucideIcon } from "lucide-react";

export const getUserCardActions = (messageIcon: LucideIcon): Action[] => {
  return [
    {
      id: "startConversation",
      label: "Message",
      icon: messageIcon,
    },
  ];
}