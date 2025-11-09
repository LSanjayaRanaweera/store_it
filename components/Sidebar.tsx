"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Originally from shadcn

interface Props {
  fullName: string;
  email: string;
  avatar: string;
}

const Sidebar = ({ fullName, email, avatar }: Props) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            // { url, name, icon } are three properties of each destructured navItem (iterator) object
            // Clicking on anything listed within <Link /> would route to url of the iterator
            // {name} is unique and is assigned to key={}
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  width={24}
                  height={24}
                  alt={name}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
/*
Access to user's fullName and email need to come from user's sessions (client session when signed in)
Access to these properties will also be needed elsewhere as well,
Hence, implementing a helper method in the component <Sidebar /> to obtain access would in turn makes it requiring to repeat it somewhere else.
Hence, the helper method is implemented in user.actions.ts >> getCurrentUser() method
NOTE: The best place to have access those properties is where <Sidebar /> is implemented (app/(root)/layout.tsx) and not in here
Hence, it's implemented in app/(root)/layout.tsx where <Sidebar /> is implemented -- values for these properties are assigned using PROPS
NOTE: We are implementing an interface to assign the 'type' (data type) of each destructured property
*/
