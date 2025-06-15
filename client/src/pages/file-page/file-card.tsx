import React from 'react';
import { Action } from '@/components/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, FileText, ImageIcon } from 'lucide-react';
import { FileType } from '@/services/types'; // adjust import path as needed

interface FileCardProps {
  file: FileType;
  actions: Action[];
  actionHandler: (actionId: string, file: FileType) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, actions, actionHandler }) => {
  const { name, description, fileURL, mimeType } = file;

  const handleCardClick = () => {
    actionHandler('item-view', file);
  };

  const isImage = mimeType.startsWith('image/');
  const isPDF = mimeType === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={fileURL}
          alt={name}
          className="w-3/4 h-32 object-cover rounded-md mb-4"
          onClick={e => e.stopPropagation()}
        />
      );
    }
    if (isPDF) {
      return (
        <div className="w-3/4 h-32 flex items-center justify-center bg-gray-100 rounded-md mb-4">
          <FileText className="w-12 h-12 text-gray-500" />
        </div>
      );
    }
    return (
      <div className="w-3/4 h-32 flex items-center justify-center bg-gray-100 rounded-md mb-4">
        <ImageIcon className="w-12 h-12 text-gray-500" />
      </div>
    );
  };

  return (
    <div className="relative border rounded-lg shadow flex flex-col bg-white">
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
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.id}
                // disabled={isActionDisabled(action)}
                onSelect={e => {
                  e.stopPropagation();
                  actionHandler(action.id, file);
                }}
                className="flex items-center gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />} {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        className="cursor-pointer hover:shadow-md rounded-lg p-4 flex flex-col h-full"
        onClick={handleCardClick}
      >
        {renderPreview()}

        <h3
          className="text-lg font-semibold mb-1"
          onClick={e => e.stopPropagation()}
        >
          {name}
        </h3>
        {description && (
          <p
            className="text-gray-600 mb-1 text-sm"
            onClick={e => e.stopPropagation()}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
