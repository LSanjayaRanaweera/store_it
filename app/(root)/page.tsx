export default function Home() {
  return (
    <div className="flex-center h-screen">
      <h1 className="h1">StoreIt - The only storage solution you need.</h1>
    </div>
  );
}
/*
------------------------------------------------------------------------------------------------------------------------
NOTE: The homepage of a Next.js project can be named either app/page.tsx OR app/index.tsx
Unlike traditional web apps, Next.js projects require NO static index.html
Instead it's SERVER-SIDE-RENDERING (SSR) and FILE-BASED-ROUTING would dynamically generate HTML from REACT components.
OPTIONAL _document.tsx can be implemented to create a custom HTML structure >> with <html>, <head>, <body> etc.
------------------------------------------------------------------------------------------------------------------------
app/layout.tsx -> for global layout and <body> structure
app/head.tsx -> for <head> content like title, meta, links etc.
------------------------------------------------------------------------------------------------------------------------
app/globals.css == global stylesheet the styles define in here will be applied across the entire application
-----------------------------------------------------------------------------------------------------------------------
NOTE: After working on (auth) directory, AuthForm.tsx etc., created a new folder >> app/(root)
In the (root) directory, create a new layout.tsx that will implement the common styles for all directory implementations.
Next, moved this file from app/page.tsx to (root) folder >> app/(root)/page.tsx
The root view would have a SideBar, a MobileNavigation and a Header
Created new files for them in 'components' folder >> Sidebar.tsx, MobileNavigation.tsx, Header.tsx
*/
