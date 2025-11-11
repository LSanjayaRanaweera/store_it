import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster"; // { Toaster } NOT { Toast }

// export const dynamic = "force-dynamic"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Accessing current 'user' from client session to implement 'fullName' and 'email' properties on <Sidebar />
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");
  return (
    <main className="flex h-screen">
      {/* destructured currentUser object and assigning all it's properties to props with same name */}
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        {/* pass the same destructured currentUser object */}
        <MobileNavigation {...currentUser} />
        {/* Prop Drilling <Layout /> <Header /> <FileUploader /> for uploadFiles() method in file.actions.ts */}
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};
export default Layout;

/*
NOTE: <Sidebar /> requires access to session {fullName} and {email}
NOTE: If we provide access DIRECTLY in <Sidebar /> then those 'session' values are available wherever <Sidebar /> is implemented,
  (OR unless a conditional is enforced??)
To prevent that and to assign proper values >> implement PROPS
Here, {...currentUser} == all properties (values) of currentUser is destructured and assigned them to a 'prop' with the same name
*/
