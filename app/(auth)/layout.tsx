import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="max-h[800px] max-w[430px] flex flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />
          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
};
export default Layout;
/* ----------------------------------------------------------------------------------------------------------------
NOTE: (auth) folder groups routes together in a single folder without affecting their URLs
The ROUTES for sign-in and sign-up pages use a relative URL path from the Homepage: https://localhost:3000
However they will disregard the (auth) folder in their relative URL path,
  e.g, The route to Sign-in == http://localhost:3000/sign-in instead of http://localhost:3000/(auth)/sign-in and
  the route to Sign-up == http://localhost:3000/sign-up instead of https://localhost:3000/(auth)/sign-up
NOTE: Neither route has (auth) in their relative URLs << omits (auth) in their path.
-------------------------------------------------------------------------------------------------------------------
NOTE: The (auth) folder has a single layout.tsx file that has common styles for each file (child) in the sub-folders.
The Layout component takes ONE destructured argument { children } << from destructuring an object {}
The value for children property == all the ReactNodes in the sub-folder?? i.e., in (auth) folder
The {children} inserting in the return statement of Layout is where the CHILD component will be inserted in the layout.
In other words, all the children in the (auth) folder will get this common layout described above and child specific
implementations will be injected @ { children } in the return statement.
*/
