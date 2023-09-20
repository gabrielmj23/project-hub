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
  const [tags, setTags] = useState((router.query.tags as string[]) ?? []);
  const [seeTags, setSeeTags] = useState(false);

  const { data: allTags, isLoading: allTagsLoading } = api.tags.getAll.useQuery();
  const { data: projects, isLoading: projectsLoading } = api.projects.getFiltered.useQuery({ search, tags });

  console.log(router.query);

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
        <div className="flex flex-row items-center gap-3">
          <label htmlFor="filter">Filter by Tags</label>
          <input
            id="filter"
            name="filter"
            type="checkbox"
            className="rounded-md"
            checked={seeTags}
            onChange={(e) => setSeeTags(e.target.checked)}
          />
        </div>
        <Link href="/new-project">
          <Button gradientDuoTone="purpleToBlue">Create project</Button>
        </Link>
      </div>
      <div
        className={`mb-4 grid grid-cols-6 items-center justify-center gap-6 px-28 ${
          seeTags ? "" : "hidden"
        }`}
      >
        {allTagsLoading ? (
          <Spinner aria-label="Loading spinner" />
        ) : (
          allTags?.sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
          }).map((tag) => (
            <div key={tag.id} className="flex flex-row items-center justify-center gap-3 bg-zinc-700 rounded-md py-1">
              <label htmlFor={tag.name}>{tag.name}</label>
              <input
                id={tag.name}
                name={tag.name}
                type="checkbox"
                className="rounded-md"
                checked={tags.includes(tag.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTags([...tags, tag.name]);
                  } else {
                    setTags(tags.filter((t) => t !== tag.name));
                  }
                  void router.push({
                    query: {
                      ...router.query,
                      tags: e.target.checked
                        ? [...tags, tag.name]
                        : tags.filter((t) => t !== tag.name),
                    },
                  });
                }}
              />
            </div>
          ))
        )}
      </div>
      {projectsLoading ? (
        <div className="container flex items-center justify-center">
          <Spinner aria-label="Loading spinner" />
        </div>
      ) : (
        <ProjectsList projects={projects} />
      )}
    </div>
  );
}

function ProjectsList({ projects }: { projects: Project[] | undefined }) {
  if (!projects) return <p>Something went wrong...</p>;

  return (
    <div className="container flex flex-col items-center justify-center gap-6 py-2">
      {projects.length == 0 ? (
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
        projects.map((project) => (
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
