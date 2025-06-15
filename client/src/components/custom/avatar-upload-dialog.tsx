// components/custom/AvatarUploadDialog.tsx
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { useToast } from '@/hooks';

interface AvatarUploadDialogProps {
  currentUrl?: string;
  onUpload: (file: File, metadata: { name: string; description: string }) => Promise<any>;
}

export function AvatarUploadDialog({ currentUrl, onUpload }: AvatarUploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const toast = useToast();

  // dropzone
  const onDrop = useCallback((accepted: File[]) => {
    setFiles(accepted);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // initialize filename
  useEffect(() => {
    if (files[0]) setFileName(files[0].name);
  }, [files]);

  const handleUpload = async () => {
    if (!files[0]) return;
    setUploading(true);
    try {
      await onUpload(files[0], { name: fileName, description: '' });
      toast.success('Profile picture updated!');
      setOpen(false);
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Avatar trigger */}
      <DialogTrigger asChild>
        <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group">
          {currentUrl ? (
            <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl text-gray-500">?</span>
            </div>
          )}
          {/* hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-opacity">
            <Edit2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>Drop or click to select an image file.</DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here …</p>
          ) : (
            <p>Drag & drop an image, or click to browse</p>
          )}
        </div>

        {files[0] && (
          <div className="mt-4 space-y-2">
            <img
              src={URL.createObjectURL(files[0])}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto"
            />
            <input
              className="w-full border rounded px-2 py-1"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
            />
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={!files[0] || uploading}>
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
