"use client";

import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import ScanList from "@/components/ScanList";
import UploadView from "@/components/UploadView";
import CategoriesView from "@/components/CategoriesView";
import TagsView from "@/components/TagsView";

export default function Home() {
  return (
    <AppLayout>
      {(activeView) => {
        switch (activeView) {
          case "dashboard":
            return <Dashboard />;
          case "scans":
            return <ScanList />;
          case "upload":
            return <UploadView />;
          case "categories":
            return <CategoriesView />;
          case "tags":
            return <TagsView />;
          default:
            return <Dashboard />;
        }
      }}
    </AppLayout>
  );
}
