import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth, useLoading, useSearch, useToast } from '@/hooks';
import { browse, suggest, getConversationId as getConv } from '@/services/users';
import { useEffect } from 'react';
import { ApiResponse } from '@/data-types/general';
import { User } from '@/services/types';
import Browser from '@/components/custom/browser-v2/browser';
import { UserCard } from '@/components/custom/browser-v2/userCard';
import { getUserCardActions } from './statics';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { routes } from '@/router/routeConfig';
import { Send } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 20;

export const PeoplePage: React.FC = () => {
  const { suggestTerm, setSuggestions, searchTerm } = useSearch();
  const toast = useToast();
  const { setLoading } = useLoading();
  const nav = useNavigate();
  const { reset } = useBreadcrumbs();
  const user = useAuth().getUser()?.user;

  const userCardActions = getUserCardActions(Send);

  const actionHandler = async (actionId: string, userId: string) => {
    console.log(actionId)
    switch (actionId) {
      case 'item-view':
        nav(routes.person.replace(':id', userId));
        break
      case 'startConversation':
        const conversation = await getConversationId(userId);
        nav(routes.chat + '?chat=' + conversation.id);
        break;
    }
  }

  // suggest users
  const { data: suggestions } = useQuery({
    queryKey: ['people-suggest', suggestTerm],
    queryFn: () => suggest({ text: suggestTerm }),
    enabled: !!suggestTerm,
  })

  // browse users
  const { data: users, fetchNextPage, hasNextPage, isLoading, error } = useInfiniteQuery<ApiResponse<User>, Error>({
    queryKey: ['people-browse', searchTerm],
    queryFn: ({ pageParam }) => browse({ text: searchTerm, pagination: pageParam }),
    enabled: true,
    initialPageParam: { fromItem: 0, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' },
    getNextPageParam: (lastPage) => {
      if (lastPage.count + lastPage.pageSize < lastPage.total) {
        return { fromItem: lastPage.count, pageSize: DEFAULT_PAGE_SIZE, orderBy: 'name', orderDir: 'asc' };
      }
      return undefined;
    },
  })

  const getConversationId = (userId: string) => {
    return getConv([userId, user?.id!]);
  }

  // set crumbs on page render
  useEffect(() => {
    reset([{ id: 'people', label: 'People', linkTo: routes.people }]);
  }, [])

  // update toast on error
  useEffect(() => {
    if (error) {
      toast.generic();
    }
  }, [error]);

  // update loader on loading state
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading]);

  // update suggestions on change
  useEffect(() => {
    if (suggestions) {
      setSuggestions(suggestions);
    }
  }, [suggestions, setSuggestions]);

  return (
    <Browser<User>
      pages={users?.pages || []}
      loadMore={fetchNextPage}
      hasMore={hasNextPage || false}
      renderItem={(user) => <UserCard user={user} actions={userCardActions} actionHandler={actionHandler} />}
      columns={3}
    />
  );
};
