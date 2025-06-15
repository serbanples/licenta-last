
import { NotFound } from "@/components/custom/notfound";
import { UserViewEdit } from "@/components/custom/user-view-edit";
import { ApiResponse } from "@/data-types/general";
import { useAuth, useLoading, useToast } from "@/hooks";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { browse, deleteFile, uploadProfilePhoto } from "@/services/file";
import { FileType, User } from "@/services/types";
import { findById, update } from "@/services/users";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const DEFAULT_PAGE_SIZE = 10;

export const PersonPage: React.FC = () => {
  const { id } = useParams();
  const { pop, push } = useBreadcrumbs();
  const hasPushedUser = useRef(false);
  const { isLoading, setLoading } = useLoading();
  const { getUser } = useAuth();
  const [isEditable, setIsEditable] = useState<boolean | undefined>(undefined);
  const toast = useToast()
  const queryClient = useQueryClient();
  const [version, setVersion] = useState(0);

  const nav = useNavigate();

  // get user data
  const { data: user, error } = useQuery({
    queryKey: ['person-find', id],
    queryFn: () => { setLoading(true); return findById(id!).then((user) => { setLoading(false); return user }) },
    enabled: !!id,
    retry: false,
  })

  const handleFileAction = (actionId: string, file: FileType) => {
    switch (actionId) {
      case 'item-view':
        nav(`/files/${file.id}`); // Navigate to file page
        break;
      case 'download':
        window.location.href = file.fileURL; // Trigger download by setting href
        break;
      case 'delete':
        // Handle delete action
        handleDelete(file.id);
        break;
    }
  }

  const handleDelete = (fileId: string) => {
    deleteFile(fileId).then(() => { queryClient.invalidateQueries({ queryKey: ['files-browse', isEditable] }), toast.success('File deleted successfully') });
  }

  // const { data: files, fetchNextPage, hasNextPage, error: friendsError } = useInfiniteQuery<ApiResponse<User>, Error>({
  //   queryKey: ['files-browse', isEditable],
  //   queryFn: ({ pageParam }) => browseFriends(pageParam as Pagination, !isEditable ? 'common' : 'mine', !isEditable ? user?.id : undefined),
  //   enabled: !!user && isEditable !== undefined,
  //   retry: false,
  //   initialPageParam: { fromItem: 0, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' },
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.count + lastPage.pageSize < lastPage.total) {
  //       return { fromItem: lastPage.count, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' };
  //     }
  //     return undefined;
  //   },
  // })

  const { data: files, fetchNextPage, hasNextPage, error: filesError } = useInfiniteQuery<ApiResponse<FileType>, Error>({
    queryKey: ['files-browse', isEditable],
    queryFn: ({ pageParam }) => browse({ pagination: pageParam, uploadedBy: user?.id }),
    enabled: !!user && isEditable !== undefined,
    retry: false,
    initialPageParam: { fromItem: 0, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' },
    getNextPageParam: (lastPage) => {
      if (lastPage.count + lastPage.pageSize < lastPage.total) {
        return { fromItem: lastPage.count, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' };
      }
      return undefined;
    },
  })

  // Update mutation: invalidate query on success to refetch
  const mutation = useMutation({
    mutationFn: (values: User) => update(values),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person-find', id] });
      setLoading(false);
      setVersion(prev => prev + 1)
    },
    onError: () => {
      toast.generic();
      setLoading(false);
    },
  });

  const handleUpload = (file: File, metadata: { name: string, description: string }) => {
    return uploadProfilePhoto(file, metadata).then(() => queryClient.invalidateQueries({ queryKey: ['person-find', id] }))
  }

  useEffect(() => {
    setLoading(false);
    if (!user) {
      return;
    }
    setIsEditable(getUser()?.user?.id === user?.id);
    if (isEditable) {
      return;
    }
    if (hasPushedUser.current) {
      pop();
      push({ id: 'user-page', label: user!.fullName, linkTo: `/people/${id}` })
    } else {
      hasPushedUser.current = true;
      push({ id: 'user-page', label: user!.fullName, linkTo: `/people/${id}` })
    }
  }, [user])

  useEffect(() => setLoading(false), [error, filesError])

  useEffect(() => setLoading(true), [id]);

  const handleSave = async (user: User) => {
    mutation.mutate(user);
  };

  if (error) {
    return <NotFound resourceName="user" />;
  }

  return (
    <>
      {
        isEditable === undefined ? <div /> :
          <UserViewEdit
            key={`${user?.id}-${version}`}
            user={user!}
            isEditable={isEditable}
            isLoading={isLoading}
            filesData={{
              files: files?.pages?.flatMap(page => page.result) || [],
              hasMore: hasNextPage,
              fetchMore: fetchNextPage,
              error: filesError
            }}
            onSave={handleSave}
            onFileAction={handleFileAction}
            onAvatarUpload={handleUpload}
          />
      }
    </>
  );
}