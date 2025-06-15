import { LucideIcon } from "lucide-react";

export const getFileActions = (downloadIcon: LucideIcon) => {
    return [
        {
            id: 'download',
            label: 'Download',
            icon: downloadIcon,
        },
    ];
}