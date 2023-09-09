import { useUser } from "@clerk/nextjs";
import { Button, Card, Spinner } from "flowbite-react";
import Head from "next/head";
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
      <Head>
        <title>ProjectHub</title>
        <meta name="description" content="Share project ideas, build your way out of junior" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""}/>
      <main className="flex min-h-screen flex-col items-center justify-center">
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
    <div className="flex flex-col container px-5 mx-4 border-slate-700 bg-stone-800 rounded-lg">
      {[...data].map((project) => (
        <Card key={project.id} className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-white">
            {project.title}
          </h5>
          <p className="font-normal text-gray-400">
            {project.description}
          </p>
        </Card>
      ))}
    </div>
  )
}
