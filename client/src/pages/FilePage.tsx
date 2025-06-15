import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotFound } from '@/components/custom/notfound';
import { useAuth, useLoading, useToast } from '@/hooks';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { deleteFile, findFileById, updateFile } from '@/services/file';
import { FileType } from '@/services/types';
import { FileViewEdit } from './file-page/file-view-edit';
import { routes } from '@/router/routeConfig';

export const FilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pop, push } = useBreadcrumbs();
  const hasPushed = useRef(false);
  const { isLoading, setLoading } = useLoading();
  const { getUser } = useAuth();
  const [isEditable, setIsEditable] = useState<boolean | undefined>(undefined);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [version, setVersion] = useState(0);

  const nav = useNavigate();

  // Fetch file data
  const { data: file, error } = useQuery<FileType>({
    queryKey: ['file-find', id],
    queryFn: () => { setLoading(true); return findFileById(id!); },
    enabled: !!id,
    retry: false,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values: any) => updateFile(id!, values),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-find', id] });
      setLoading(false);
      setVersion(v => v + 1);
      toast.success('File updated');
    },
    onError: () => {
      toast.error('Update failed');
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!file) return;
    const me = getUser()?.user?.id;
    setIsEditable(me === file.uploadedBy.id);

    if (hasPushed.current) {
      pop();
      push({ id: 'file-page', label: file.name, linkTo: `/files/${id}` });
    } else {
      hasPushed.current = true;
      push({ id: 'file-page', label: file.name, linkTo: `/files/${id}` });
    }
    setLoading(false);
  }, [file]);

  useEffect(() => {
    setLoading(false);
  }, [error]);

  useEffect(() => {
    setLoading(true);
  }, [id]);

  const handleSave = (updated: FileType) => {
    mutation.mutate(updated);
  };

  const handleDelete = (fileId: string) => {
    deleteFile(fileId).then(() => nav(routes.files));
  }

  if (error) {
    return <NotFound resourceName="file" />;
  }

  return (
    <>
      {isEditable === undefined ? <div /> : (
        <FileViewEdit
          key={`${file?.id}-${version}`}
          file={file!}
          isEditable={isEditable}
          isLoading={isLoading}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
