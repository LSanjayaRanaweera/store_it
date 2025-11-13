import { Models } from "node-appwrite";

const Card = ({ file }: { file: Models.Document }) => {
  return <div>{file.name}</div>;
};
export default Card;
// Both <Card /> and where it is implemented, i.e., app/(root)/[type]/page.tsx require PROPS  >> {file={--file--}}
