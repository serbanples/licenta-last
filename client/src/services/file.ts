import { ApiResponse } from "@/data-types/general";
import { POST, POST_UPLOAD } from "./requestHandler";
import { FileType } from "./types";

export const uploadFile = async (file: File, metadata: { name: string, description: string}): Promise<any> => {
    // const data = { file: file };
    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(metadata));
    return POST_UPLOAD('/api/files/upload/file', form).then((data) => data);
}

export const uploadProfilePhoto = async (file: File, metadata: { name: string, description: string}): Promise<any> => {
    // const data = { file: file };
    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(metadata));
    return POST_UPLOAD('/api/files/upload/profile-photo', form).then((data) => data);
}

export const browse = async(filter: Record<string, any>): Promise<ApiResponse<FileType>> => {
  return POST('/files/browse', {...filter, populate: true})
} 

export const findFileById = async (id: string): Promise<FileType> => {
    return POST('/files/browse', { _id: id, populate: true })
        .then((data) => { 
            if(data.result.length) return data.result[0] as FileType
            else throw new Error('File not found');
        });
}

export const updateFile = async (id: string, metadata: { name: string, description: string}): Promise<FileType> => {
    return POST('/files/update', { _id: id, metadata })
        .then((data) => { 
            if(data.result.length) return data.result[0] as FileType
            else throw new Error('File not found');
        });
}

export const deleteFile = async (id: string): Promise<void> => {
    return POST('/files/delete', { id: id })
}