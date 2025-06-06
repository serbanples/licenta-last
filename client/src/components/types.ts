import { User } from "@/services/types";
import { LucideIcon } from "lucide-react";

export interface Action {
  id: string;
  label: string;
  icon: LucideIcon;
  displayRule?: (userId: string, viewedUser: User) => boolean
  disabled?: (userId: string, viewedUser: User) => boolean
}