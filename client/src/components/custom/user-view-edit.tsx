import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InfiniteCarousel } from './carousel';
import { FileType, User } from '@/services/types';
import { Eye, Download, Trash2 } from 'lucide-react';
import { FileCard } from '@/pages/file-page/file-card';
import { AvatarUploadDialog } from './avatar-upload-dialog';

interface UserViewEditProps {
  user: User;
  isEditable: boolean;
  isLoading: boolean;
  onSave?: (user: User) => void;
  // files data instead of friends
  filesData: {
    files: FileType[];
    hasMore: boolean;
    fetchMore: () => void;
    error: any;
  };
  onFileAction: (actionId: string, file: FileType) => void;
  onAvatarUpload: (file: File, metadata: { name: string; description: string }) => Promise<any>;
}

export const UserViewEdit: React.FC<UserViewEditProps> = ({
  user,
  isEditable,
  isLoading,
  onSave,
  filesData,
  onFileAction,
  onAvatarUpload
}) => {
  const [formState, setFormState] = useState<User>(user);
  const { files, hasMore, fetchMore, error } = filesData;

  useEffect(() => {
    setFormState(user);
  }, [user]);

  const handleChange =
    (field: keyof User) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState(s => ({ ...s, [field]: e.target.value }));
      };

  const handleSave = () => {
    if (onSave) onSave(formState);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-center">
          {isEditable ? "Your Profile" : `${user.fullName}'s Profile`}
        </h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              {/* <Avatar className="w-24 h-24">
                <AvatarImage src={user.photoUrl} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar> */}
              <div className="flex items-center space-x-4">
                {isEditable ? (
                  <AvatarUploadDialog
                    currentUrl={user.profilePictureUrl}
                    onUpload={onAvatarUpload}
                  />
                ) : (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                {isEditable ? (
                  <Input
                    value={formState.fullName}
                    placeholder="Full Name"
                    onChange={handleChange('fullName')}
                    className="flex-1"
                  />
                ) : (
                  <h2 className="text-2xl font-medium">{user.fullName}</h2>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                {isEditable ? (
                  <Textarea
                    value={formState.description}
                    placeholder="Tell us about yourself"
                    onChange={handleChange('description')}
                    className="w-full"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {user.description}
                  </p>
                )}
              </div>

              {isEditable && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>

        <div>
          <div className="text-lg font-semibold mb-4">
            {isEditable ? 'My Files' : "User's Files"}
          </div>
          {error ? (
            <div>Error loading files</div>
          ) : (
            <InfiniteCarousel
              items={files}
              hasMore={hasMore}
              loadMore={fetchMore}
              itemWidthPx={200}
              className="px-2"
              renderItem={file => (
                <FileCard
                  key={file.id}
                  file={file}
                  actions={[
                    { id: 'view', label: 'View', icon: Eye },
                    { id: 'download', label: 'Download', icon: Download },
                    { id: 'delete', label: 'Delete', icon: Trash2, disabled: () => !isEditable },
                  ]}
                  actionHandler={(actionId: string) => onFileAction(actionId, file)}
                />
              )}
            />
          )}
        </div>
      </main>
    </div>
  );
};
