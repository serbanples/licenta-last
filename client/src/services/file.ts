import { POST_UPLOAD } from "./requestHandler";

export const uploadFile = async (file: File, metadata: { name: string, description: string}): Promise<any> => {
    // const data = { file: file };
    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(metadata));
    return POST_UPLOAD('/api/files/upload/file', form).then((data) => data);
}