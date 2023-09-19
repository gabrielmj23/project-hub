import { useUser } from "@clerk/nextjs";
import { type Project } from "@prisma/client";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Nav from "~/components/Nav";
import PostCard from "~/components/PostCard";
import { api } from "~/utils/api";

export default function Home() {
  const user = useUser();
  if (!user || !user.isSignedIn || !user.isLoaded) {
    return null;
  }

  return (
    <>
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
      <main className="mt-16 flex min-h-screen flex-col items-center">
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-white">
          Browse project ideas
        </h1>
        <ProjectSection />
      </main>
    </>
  );
}

function ProjectSection() {
  const router = useRouter();
  const [search, setSearch] = useState((router.query.search as string) ?? "");
  const { data, isLoading } = api.projects.getBySearch.useQuery(search);

  return (
    <div className="container mx-4 flex max-w-6xl flex-col rounded-lg border-slate-700 bg-stone-800 py-4">
      <div className="mb-4 flex flex-row items-center justify-center gap-12 px-5">
        <input
          id="search"
          name="search"
          type="text"
          value={search}
          placeholder="Search..."
          className=" rounded-lg border-zinc-900 bg-stone-700"
          onChange={(e) => {
            setSearch(e.target.value);
            void router.push({
              query: {
                ...router.query,
                search: e.target.value,
              },
            });
          }}
        />
        <Link href="/new-project">
          <Button gradientDuoTone="purpleToBlue">Create project</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="container flex items-center justify-center">
          <Spinner aria-label="Loading spinner" />
        </div>
      ) : (
        <ProjectsList data={data} />
      )}
    </div>
  );
}

function ProjectsList({ data }: { data: Project[] | undefined }) {
  if (!data) return <p>Something went wrong...</p>;

  return (
    <div className="container flex flex-col items-center justify-center gap-6">
      {data.length == 0 ? (
        <>
          <p>No projects yet :^(</p>
          <p>Why not create one?</p>
          <Link href="/new-project">
            <Button className="mt-4" gradientDuoTone="purpleToBlue">
              Create project
            </Button>
          </Link>
        </>
      ) : (
        data.map((project) => (
          <PostCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
          />
        ))
      )}
    </div>
  );
}
