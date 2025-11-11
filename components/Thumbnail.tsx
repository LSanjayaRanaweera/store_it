import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface Props {
  type: string;
  extension: string;
  url?: string; // the '?' == means this property is optional, i.e., "Required" inputs are ONLY type, extension
  imageClassName?: string; // optional
  className?: string; // optional
}

const Thumbnail = ({
  type,
  extension,
  url = "", // Initialize to empty string even though this input is optional
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image",
        )}
      />
    </figure>
  );
};
export default Thumbnail;

// The <figure> element in HTML is used to semantically group media content—like images, illustrations, diagrams, code snippets, or videos—with an optional caption
