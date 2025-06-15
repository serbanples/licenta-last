// import Browser from "@/components/custom/browser-v2/browser";
// import { ApiResponse } from "@/data-types/general";
// import { useLoading, useSearch, useToast } from "@/hooks";
// import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
// import { routes } from "@/router/routeConfig";
// import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FileUploadDialog from "./file-page/file-uploader-dialog";
import { routes } from "@/router/routeConfig";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { uploadFile } from "@/services/file";

// const DEFAULT_PAGE_SIZE = 10;

export const FilesPage: React.FC = () => {
  // const { suggestTerm, setSuggestions, searchTerm } = useSearch();
  // const toast = useToast();
  // const { setLoading } = useLoading();
  // const nav = useNavigate();
  const { reset } = useBreadcrumbs();
  // const qc = useQueryClient();

  // // const userCardActions = getUserCardActions(Send, Plus, Minus, X);

  // const actionHandler = (actionId: string, userId: string) => {
  //   switch (actionId) {
  //     case 'item-view':
  //       nav(routes.person.replace(':id', userId));
  //       break
  //     case 'startConversation':
  //       break;
  //     case 'addFriend':
  //       requestAddFriendMutation.mutate(userId);
  //       break;
  //     case 'removeFriend':
  //       removeFriendMutation.mutate(userId);
  //       break;
  //     case 'cancelFriendRequest':
  //       cancelAddFriendMutation.mutate(userId);
  //       break;
  //   }
  // }

  // // suggest users
  // const { data: suggestions } = useQuery({
  //   queryKey: ['files-suggest', suggestTerm],
  //   queryFn: () => suggest({ text: suggestTerm }),
  //   enabled: !!suggestTerm,
  // })

  // // const requestAddFriendMutation = useMutation({
  // //   mutationFn: (friendId: string) => requestAddFriend(friendId),
  // //   onError: () => {
  // //     toast.error('There was an error adding a friend');
  // //   },
  // //   onSuccess: async () => {
  // //     qc.invalidateQueries({ queryKey: ['people-browse'] });
  // //   },
  // // })

  // // const cancelAddFriendMutation = useMutation({
  // //   mutationFn: (friendId: string) => cancelAddFriend(friendId),
  // //   onError: () => {
  // //     toast.error('There was an error cancelling the friend request');
  // //   },
  // //   onSuccess: async () => {
  // //     qc.invalidateQueries({ queryKey: ['people-browse'] });
  // //   },
  // // })

  // // const removeFriendMutation = useMutation({
  // //   mutationFn: (friendId: string) => removeFriend(friendId),
  // //   onError: () => {
  // //     toast.error('There was an error removing this friend');
  // //   },
  // //   onSuccess: async () => {
  // //     qc.invalidateQueries({ queryKey: ['people-browse'] });
  // //   },
  // // })

  // // browse users
  // const { data: files, fetchNextPage, hasNextPage, isLoading, error } = useInfiniteQuery<ApiResponse<any>, Error>({
  //   queryKey: ['people-browse', searchTerm],
  //   queryFn: ({ pageParam }) => browse({ text: searchTerm, pagination: pageParam }),
  //   enabled: true,
  //   initialPageParam: { fromItem: 0, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' },
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.count + lastPage.pageSize < lastPage.total) {
  //       return { fromItem: lastPage.count, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' };
  //     }
  //     return undefined;
  //   },
  // })

  // set crumbs on page render
  useEffect(() => {
    reset([{ id: 'files', label: 'Files', linkTo: routes.files }]);
  }, [])

  const handleUpload = (file: File, metadata: { name: string, description: string}) => {
    return uploadFile(file, metadata);
  }

  // // update toast on error
  // useEffect(() => {
  //   if (error) {
  //     toast.generic();
  //   }
  // }, [error]);

  // // update loader on loading state
  // useEffect(() => {
  //   setLoading(isLoading)
  // }, [isLoading]);

  // // update suggestions on change
  // useEffect(() => {
  //   if (suggestions) {
  //     setSuggestions(suggestions);
  //   }
  // }, [suggestions, setSuggestions]);

  return (
    <div>
      {/* <Browser<any>
        pages={files?.pages || []}
        loadMore={fetchNextPage}
        hasMore={hasNextPage || false}
        renderItem={(user) => <FileCard user={user} actions={[]} actionHandler={actionHandler} />}
        columns={3}
      /> */}
      <FileUploadDialog onUpload={handleUpload} />
    </div>
  );
}