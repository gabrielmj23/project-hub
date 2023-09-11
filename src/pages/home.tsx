import { useUser } from "@clerk/nextjs";
import { Button, Card, Spinner } from "flowbite-react";
import Link from "next/link";
import Nav from "~/components/Nav";
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
      <div className="flex flex-col container">
        {[...data].map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}  className="container max-w-3xl mb-6 place-self-center">
            <Card className="bg-zinc-800 hover:bg-zinc-700">
              <h5 className="text-2xl font-bold tracking-tight text-white">
                {project.title}
              </h5>
              <p className="font-normal text-gray-400">
                {project.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
