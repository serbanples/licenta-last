import { useCallback, useState } from 'react';
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

export default function FileUploadDialog() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      {/* Floating Upload Button */}
      <Dialog>
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
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files, or click to select files</p>
            )}
          </div>

          {files.length > 0 && (
            <aside className="mt-4">
              <h4 className="font-semibold mb-2">Files to upload</h4>
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
            <Button variant="outline" onClick={() => setFiles([])}>
              Clear
            </Button>
            <Button
              disabled={files.length === 0}
              onClick={() => {
                // handle actual upload logic here
                console.log('Uploading files:', files);
              }}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
