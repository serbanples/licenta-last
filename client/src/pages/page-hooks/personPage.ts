// import { ApiResponse } from "@/data-types/general";
// import { useLoading } from "@/hooks";
// import { Pagination, User } from "@/services/types";
// import { browseFriends, findById, update } from "@/services/users";
// import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";

// const DEFAULT_PAGE_SIZE = 20;

// export const useGetMyFriends = () => {
//   const { data, fetchNextPage, hasNextPage, error } = useInfiniteQuery<ApiResponse<User>, Error>({
//     queryKey: ['friends-browse', true],
//     queryFn: ({ pageParam }) => browseFriends(pageParam as Pagination, !true ? 'common' : 'mine', !true ? 'id' : undefined),
//     enabled: !!true && true !== undefined,
//     retry: false,
//     initialPageParam: { fromItem: 0, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' },
//     getNextPageParam: (lastPage) => {
//       if (lastPage.count + lastPage.pageSize < lastPage.total) {
//         return { fromItem: lastPage.count, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' };
//       }
//       return undefined;
//     },
//   })

//   useEffect(() => {

//   })
// }

// export const useFindUserById = (id: string) => {
//   const { setLoading } = useLoading();
//   const { data, error } = useQuery({
//     queryKey: ['person-find', id],
//     queryFn: () => { setLoading(true); return findById(id)},
//     enabled: !!id,
//     retry: false,
//   })

//   return { user: data, userError: error };
// }

// export const useSaveUser = () => {
//   // Update mutation: invalidate query on success to refetch
//   const mutation = useMutation({
//     mutationFn: (values: User) => update(values),
//     onMutate: () => setLoading(true),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['person-find', id] });
//       setLoading(false);
//       setVersion(prev => prev + 1)
//     },
//     onError: () => {
//       toast.generic();
//       setLoading(false);
//     },
//   });
// }