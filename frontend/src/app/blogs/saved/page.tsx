"use client";

import BlogCard from "@/components/BlogCard";
import { PageLoading } from "@/components/Loading";
import SideBar from "@/components/SidebarComp";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppData } from "@/context/AppContext";

const HomeContent = () => {
  const { savedBlogs, blogLoading, blogs } = useAppData();
  const filteredBlogs = blogs?.filter((blog) =>
    savedBlogs?.some((saved) => saved.blogid === blog.id.toString())
  );
  return (
    <main>
      <div className="flex items-center px-6 py-6">
        <h1 className="text-3xl font-bold">Saved Blogs</h1>
      </div>

      <div className="container mx-auto px-4 pb-6">
        {blogLoading ? (
          <PageLoading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                             xl:grid-cols-5
                             2xl:grid-cols-6
                            gap-12">
            {filteredBlogs?.length === 0 && <p>No Blogs Yet</p>}
            {filteredBlogs?.map((e, i) => (
              <BlogCard
                key={i}
                image={e.image}
                title={e.title}
                id={e.id}
                time={e.create_at}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};


const SavedBlogs = () => {
  const { loading } = useAppData();
  if (loading) return <PageLoading />;

  return (
    <SidebarProvider>
      <div className="flex">
        <SideBar />
        <HomeContent />
      </div>
    </SidebarProvider>
  );
};

export default SavedBlogs;