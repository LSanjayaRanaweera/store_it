"use client"; // Especially if we are using useState hook, this needs to be run ONLY on client side

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { renameFile, updateFileUsers } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null); // ------------------------------------Go over
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]); // for <ShareInput /> Implementation in renderDialogContent() callback

  const path = usePathname();

  // helper 1- if we select the option to CANCEL the action
  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setName(file.name);
    // setEmail[]
  };
  // helper 2 - if we DON"T cancel and SELECT an action
  const handleAction = async () => {
    if (!action) return; // Don't do anything
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () => console.log("Delete"),
    };
    // ------------------------------------------------------------- Go over, clarify what's being implied here by each part of the code?
    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();
    setIsLoading(false);
  };
  // helper 3 - remove a user from a list of emails
  const handleRemoveUser = async (email: string) => {
    // Filer the email out of emails list -- only return unmatched emails
    const updateEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updateEmails, // Assign new value for emails
      path,
    });
    if (success) setEmails(updateEmails);
    closeAllModals();
  };

  // what does this helper function do?
  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {/* Checking if each dropdown choice matches with selected 'value' */}
          {/* 1. Rename  */}
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {/* 2. Details  */}
          {value === "details" && <FileDetails file={file} />}
          {/* 3. Share */}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {/* 4. Delete */}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icon/loader.svg"
                  alt="loader"
                  height={24}
                  width={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    // Go over the attributes of <Dialog /> and <DropdownMenu /> (from shadcn)  and their assignments to useState()
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  ["rename", "details", "share", "delete"].includes(
                    actionItem.value,
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)} // Important to have correct construct(fn) for href
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
/*
 In the parameters ({file}: {file: Models.Document}),
    the {file} === PROP
    the {file: Models.Document} == data type
------------------------------------------------------------------------------------------------------------------------
NOTE: The renderDialogContent() callback, implements @/components/ui/dialog installed from shadcn.
This callback is implemented at the bottom of the return statement, underneath the <Dialog /> wrapper.
Therefore, it is the last implementation of <ActionDropdown /> component.
The callback renderDialogContent(), first checks if there was an action, i.e., does action has a value? for the value of action.
In the return statement of <ActionDropdown />, setAction() is invoked on an OnClick event >> update the value of state variable 'action'.
This 'value' of the dropdown selection is later compared with each selection choice and depending on that match a different
callback is executed to implement the action.
------------------------------------------------------------------------------------------------------------------------
*/
