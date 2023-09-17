import { useUser } from "@clerk/nextjs";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import PostCard from "~/components/PostCard";
import { api } from "~/utils/api";

export default function Profile() {
  const user = useUser();
  const router = useRouter();

  if (!user || !user.isSignedIn)
    return null;

  // Fetch user data
  const userData  = api.users.getByUsername.useQuery(router.query.slug as string);
  const projectsData = api.projects.getByAuthorId.useQuery(userData.data?.id ?? "");
  if (userData.isLoading || projectsData.isLoading) {
    return (
      <>
        <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
        <main className="flex min-h-screen flex-col items-center justify-center">
          <Spinner />
        </main>
      </>
    )
  }
  if (userData.isError || projectsData.isError) {
    return (
      <>
        <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
        <main className="flex min-h-screen flex-col items-center justify-center">
          <p>Something went wrong...</p>
        </main>
      </>
    )
  }
  
  const [slugUser, projects] = [userData.data, projectsData.data];

  return (
    <>
      <Head>
        <title>{slugUser.username}</title>
      </Head>
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="my-4 flex h-1/2 w-4/5 flex-col gap-2 items-center justify-center rounded-lg bg-stone-800 px-8 py-4 text-white">
          <Image className="rounded-full" src={slugUser.imageUrl} alt="Profile picture" width={150} height={150} />
          <h1 className="text-3xl font-bold">{slugUser.username}</h1>
        </div>
        <div className="my-4 flex h-1/2 w-4/5 flex-col gap-2 items-center justify-center rounded-lg bg-stone-800 px-8 py-4 text-white">
        <div className="flex flex-col container gap-6">
        {projects.map((project) => (
          <PostCard key={project.id} id={project.id} title={project.title} description={project.description} />
        ))}
      </div>
        </div>
      </main>
    </>
  );
}