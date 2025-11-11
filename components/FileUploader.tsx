"use client";

import { useCallback, useState } from "react"; // useCallback hook - a performance optimizer that control SUBSEQUENT component rerender
import { useDropzone } from "react-dropzone"; // CUSTOM HOOK from 'react-dropzone'
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast"; // From run npx shadcn@latest add toast. However, <Toast /> is now deprecated
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/actions/file.actions";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string; // ? == optional
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  //
  const { toast } = useToast(); // toast === display a temporary message
  // Initialize state as an empty array that will eventually contain File objects, Array of File objects << where the changes going to happen
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with these files
      setFiles(acceptedFiles);

      // After creating uploadFile() utility method in file.actions.ts, implement this functionality.
      // Files can be uploaded by multiple users ata the same time. ? all uploading files are provided as an array of files == File[]
      const uploadPromises = acceptedFiles.map(async (file) => {
        // "uploadPromises" do? check and get rid of the files that can't be uploaded??
        // 1st check the file size to determine if it's uploadable or not << this will clear UPLOADING FILE ARRAY from files that don't match Max_file_size criteria
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          // before implementing toast. run npx shadcn@latest add toast
          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB
              </p>
            ),
            className: "error-toast",
          });
        }
        // when file is uploadable ( < Max_size)
        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        );
      });
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path], // Only rerenders if any of the values in dependency array changes
  );
  /* NOTE: If a file is uploadable or not, once evaluated by uploadPromises(), that file will be removed from the list of files = File[]
     If a file is too big, it will be removed from 'files' by setFiles() and return an error == too big
     If the file is uploadable,
  */

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Callback to remove files
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    // Keep all the files that doesn't match the name of the clicked (to remove) file
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default FileUploader;

/*
useCallback hook -- a performance optimization tool.
In initial RENDER it returns the function that was passed in.
In SUBSEQUENT renders (rerenders) it compares the change in values (current) to the values in the dependency array (previous).

It lets you cache a function definition between component re-renders. In other words it compares a
Hence, It prevents a function from being recreated unnecessarily maintaining its referential equality.

*/
