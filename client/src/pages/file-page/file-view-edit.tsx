import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ImageIcon, Download, Trash2, UserIcon } from 'lucide-react';
import { FileType } from '@/services/types';

interface FileViewEditProps {
  file: FileType & {
    uploadedBy: { id: string; fullName: string; email: string };
  };
  isEditable: boolean;
  isLoading: boolean;
  onSave?: (file: FileType) => void;
  onDelete?: (fileId: string) => void;
}

export const FileViewEdit: React.FC<FileViewEditProps> = ({
  file,
  isEditable,
  isLoading,
  onSave,
  onDelete,
}) => {
  const [formState, setFormState] = useState(file);

  useEffect(() => {
    setFormState(file);
  }, [file]);

  const handleChange =
    (field: keyof Pick<FileType, 'name' | 'description'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    if (onSave) onSave(formState);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(file.id);
  };

  const isImage = formState.mimeType.startsWith('image/');
  const isPDF = formState.mimeType === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={formState.fileURL}
          alt={formState.name}
          className="w-1/2 h-full object-cover rounded-md"
        />
      );
    }
    if (isPDF) {
      return (
        <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-md">
          <FileText className="w-12 h-12 text-gray-500" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-md">
        <ImageIcon className="w-12 h-12 text-gray-500" />
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{file.name} Details</h1>
          <div className="mt-1 flex items-center text-sm text-gray-600 space-x-1">
            <UserIcon className="w-4 h-4" />
            <span>
              Uploaded by{' '}
              <Link
                to={`/people/${formState.uploadedBy.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {formState.uploadedBy.fullName}
              </Link>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* <a
            href={formState.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          > */}
          <div className="inline-flex items-center gap-1 text-blue-600 hover:underline" onClick={() => window.location.href = formState.fileURL}>
            <Download className="w-5 h-5" /> Download
          </div>
          {/* </a> */}
          {isEditable && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label="Delete file"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {isEditable ? 'Edit File' : formState.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 h-full flex flex-col">
            {/* Preview */}
            {renderPreview()}

            {/* File Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Name</label>
              {isEditable ? (
                <Input
                  value={formState.name}
                  onChange={handleChange('name')}
                  className="w-full"
                />
              ) : (
                <p className="text-lg font-semibold">{formState.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-1">Description</label>
              {isEditable ? (
                <Textarea
                  value={formState.description}
                  onChange={handleChange('description')}
                  className="w-full flex-1"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground flex-1 overflow-auto">
                  {formState.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* MIME and size */}
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-gray-500">
                MIME Type: {formState.mimeType}
              </div>
              <div className="text-sm text-gray-500">
                Size: {(formState.size / 1024).toFixed(2)} KB
              </div>
            </div>

            {/* Save button */}
            {isEditable && (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
