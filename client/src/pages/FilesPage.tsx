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
import { browse, uploadFile } from "@/services/file";
import { FileType } from "@/services/types";
import Browser from "@/components/custom/browser-v2/browser";
import { FileCard } from "./file-page/file-card";
import { getFileActions } from "./file-page/statics";
import { DownloadCloudIcon } from "lucide-react";
import { useLoading, useSearch, useToast } from "@/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/data-types/general";
import { useNavigate } from "react-router-dom";

const DEFAULT_PAGE_SIZE = 20;

export const FilesPage: React.FC = () => {
  const { searchTerm } = useSearch();
  const toast = useToast();
  const { setLoading } = useLoading();
  const nav = useNavigate();
  const { reset } = useBreadcrumbs();

  const filecardActions = getFileActions(DownloadCloudIcon);

  const actionHandler = (actionId: string, file: FileType) => {
    switch (actionId) {
      case 'item-view':
        nav(routes.file.replace(':id', file.id));
        break;
      case 'download':
        window.location.href = file.fileURL; // Trigger download by setting href
        break;
    }
  }

  // const { data: suggestions } = useQuery({
  //   queryKey: ['people-suggest', suggestTerm],
  //   queryFn: () => suggest({ text: suggestTerm }),
  //   enabled: !!suggestTerm,
  // })

  // browse files
  const { data: files, fetchNextPage, hasNextPage, isLoading, error } = useInfiniteQuery<ApiResponse<FileType>, Error>({
    queryKey: ['files-browse', searchTerm],
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

  // set crumbs on page render
  useEffect(() => {
    reset([{ id: 'files', label: 'Files', linkTo: routes.files }]);
  }, [])

  const handleUpload = (file: File, metadata: { name: string, description: string }) => {
    return uploadFile(file, metadata);
  }

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

  return (
    <div>
      <Browser<FileType>
        pages={files?.pages || []}
        loadMore={fetchNextPage}
        hasMore={hasNextPage || false}
        renderItem={(file) => <FileCard file={file} actions={filecardActions} actionHandler={actionHandler} />}
        columns={3}
      />
      <FileUploadDialog onUpload={handleUpload} />
    </div>
  );
}