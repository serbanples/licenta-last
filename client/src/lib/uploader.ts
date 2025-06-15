import { useEffect, useState } from "react";
import { NotificationTopicEnum } from "./notifications";
import { useSSETopic } from "./sse";
import { useToast } from "@/hooks";

export const useUploader = () => {
    const [progress, setProgress] = useState(0);
    const sseNewValue = useSSETopic<any>(NotificationTopicEnum.UPLOAD);
    const toast = useToast();

    useEffect(() => {
        if (sseNewValue && sseNewValue.data.status === 'uploading') {
            setProgress(sseNewValue.data?.progress);
        }
        if(sseNewValue && sseNewValue.data.status === 'success') {
            setProgress(100);
            toast.success('File uploaded successfully!');
        }
        if(sseNewValue && sseNewValue.data.status === 'failed') {
            setProgress(0);
            toast.error('File upload failed. Please try again.');
        }
    }, [sseNewValue]);

    return progress;
}