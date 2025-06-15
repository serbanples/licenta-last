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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks';

export default function FileUploadDialog({
  onUpload,
}: {
  onUpload: (
    file: File,
    metadata: { name: string; description: string }
  ) => Promise<any>;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  // metadata fields
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');

  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // initialize name when file selected
  useEffect(() => {
    if (files.length > 0) {
      setFileName(files[0].name);
      setDescription('');
    }
  }, [files]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      await onUpload(file, { name: fileName, description });
      toast.success('Upload successful!');
      setFiles([]);
      setOpen(false);  // close dialog on success
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 z-50 shadow-lg">
            Upload Files
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Drag and drop your files here, or click to browse.
            </DialogDescription>
          </DialogHeader>

          <div
            {...getRootProps()}
            className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors 
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
          >
            <input {...getInputProps()}/>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files, or click to select files</p>
            )}
          </div>

          {files.length > 0 && (
            <aside className="mt-4 space-y-4">
              <h4 className="font-semibold mb-2">File details</h4>
              <Input
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="w-full"
              />
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                className="w-full"
                rows={3}
              />
              <ul className="list-disc list-inside space-y-1">
                {files.map((file, idx) => (
                  <li key={idx} className="text-sm">
                    {file.name}{' '}
                    <span className="text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Clear
            </Button>
            <Button
              disabled={files.length === 0 || uploading}
              onClick={() => handleUpload(files[0])}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
