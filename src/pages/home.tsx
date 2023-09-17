import { useUser } from "@clerk/nextjs";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
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
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""}/>
      <main className="flex min-h-screen flex-col items-center mt-16">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-5">
          Browse project ideas
        </h1>
        <ProjectsList />
      </main>
    </>
  );
}

function ProjectsList() {
  const {data, isLoading} = api.projects.getAll.useQuery();
  if (isLoading)
    return <Spinner aria-label="Loading spinner" />
    
  if (!data)
    return <p>Something went wrong...</p>

  if (data.length === 0)
    return (
      <>
        <p>No projects yet :^(</p>
        <p>Why not create one?</p>
        <Link href="/new-project">
          <Button className="mt-4" gradientDuoTone="purpleToBlue">Create project</Button>
        </Link>
      </>
    );

  return (
    <div className="flex flex-col container max-w-6xl py-4 mx-4 border-slate-700 bg-stone-800 rounded-lg">
      <div className="flex flex-col items-end px-5 mb-4">
        <Link href="/new-project">
          <Button className="mt-4" gradientDuoTone="purpleToBlue">Create project</Button>
        </Link>
      </div>
      <div className="flex flex-col container gap-6">
        {[...data].map((project) => (
          <PostCard key={project.id} id={project.id} title={project.title} description={project.description} />
        ))}
      </div>
    </div>
  )
}
