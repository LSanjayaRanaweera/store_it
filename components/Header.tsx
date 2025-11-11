import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        {/* Prop Drilling from <FileUploader /> <Header /> to <Layout /> */}
        <FileUploader ownerId={userId} accountId={accountId} />
        {/* NOTE: below */}
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="Logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;
/*
NOTE: <Header/> is a SERVER component >> NOT a CLIENT component.
signOutUser() is a client side functionality and with React 19 and after, it let us implement a "client side functionality
on a server side component" using the action={} attribute of a <form> element
*/
