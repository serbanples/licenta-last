import { Action } from '@/components/types';
import { User } from '@/services/types';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useAuth } from '@/hooks';

interface UserCardProps {
  user: User;
  /**
   * All actions for this card appear in the overflow menu.
   */
  actions: Action[];
  /**
   * Handler for actions, including the card click as an "item-view" action.
   */
  actionHandler: (actionId: string, userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, actions, actionHandler }) => {
  const { id, fullName, email, description, photoUrl } = user;
  const { getUser } = useAuth();
  const loggedInUserId = getUser()?.user?.id;

  // Trigger an "item-view" action on card click
  const handleCardClick = () => {
    actionHandler('item-view', id);
  };

  const isActionDisabled = (action: Action) => {
    if (action.disabled) {
      return action.disabled(loggedInUserId!, user);
    }
    return false;
  }

  const isActionDisplayed = (action: Action) => {
    if (action.displayRule) {
      return action.displayRule(loggedInUserId!, user);
    }
    return true;
  }

  return (
    <div
      className="relative border rounded-lg shadow flex flex-col bg-white"
    >
      {/* Overflow menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={e => e.stopPropagation()}
            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-40">
          {actions.map(action => {
            if (!isActionDisplayed(action)) {
              return null;
            }
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.id}
                disabled={isActionDisabled(action)}
                onSelect={(e) => {
                  e.stopPropagation();
                  actionHandler(action.id, id);
                }}
                className="flex items-center gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />} {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile photo */}
      <div className='cursor-pointer hover:shadow-md rounded-lg p-6 flex flex-col h-full w-full' onClick={handleCardClick}>
        {photoUrl && (
          <img
            src={photoUrl}
            alt={fullName}
            className="w-full h-32 object-cover rounded-md mb-4"
            onClick={e => e.stopPropagation()}
          />
        )}

        <h3
          className="text-xl font-semibold mb-1"
          onClick={e => e.stopPropagation()}
        >
          {fullName}
        </h3>
        {description && (
          <p
            className="text-gray-600 mb-1"
            onClick={e => e.stopPropagation()}
          >
            {description}
          </p>
        )}
        <div
          className="text-gray-500"
          onClick={e => e.stopPropagation()}
        >
          {email}
        </div>
      </div>
    </div>
  );
};
