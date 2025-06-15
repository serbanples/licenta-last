import { useEffect } from "react";
import { NotificationTopicEnum } from "./notifications";
import { useSSETopic } from "./sse";

export const useUploader = () => {
    const sseNewValue = useSSETopic<any>(NotificationTopicEnum.UPLOAD);

    useEffect(() => {
        if (sseNewValue) {
            console.log(sseNewValue);
            // Handle the new upload notification here
            // For example, you could update a state or trigger a UI update
        }
    }, [sseNewValue]);
}