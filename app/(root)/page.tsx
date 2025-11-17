import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />
        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    alt="uploaded image"
                    width={100}
                    height={100}
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 x1:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                key={file.$id}
                className="flex items-center gap-3"
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};
export default Dashboard;
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
