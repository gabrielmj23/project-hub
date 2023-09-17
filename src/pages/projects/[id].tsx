import { useUser } from "@clerk/nextjs";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";

export default function ProjectView() {
  const user = useUser();
  const router = useRouter();

  if (!user || !user.isSignedIn)
    return null;

  const data  = api.projects.getById.useQuery(router.query.id as string);
  if (data.isLoading) {
    return (
      <>
        <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
        <main className="flex min-h-screen flex-col items-center justify-center">
          <Spinner />
        </main>
      </>
    )
  }
  if (data.isError) {
    return (
      <>
        <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
        <main className="flex min-h-screen flex-col items-center justify-center">
          <p>Something went wrong...</p>
        </main>
      </>
    )
  }

  const { project, author } = data.data;
  return (
    <>
      <Head>
        <title>{project.title}</title>
      </Head>
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="my-8 flex h-1/2 w-4/5 flex-col gap-2 items-center justify-center rounded-lg bg-stone-800 px-8 py-4 text-white">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <span className="flex flex-row gap-1">
            <p className="text-gray-400 text-md">Posted by</p>
            <Link className="text-gray-300 hover:text-gray-200 tex-md" href={`/users/${author.username}`}>{author.username}</Link>
          </span>
          <p className="text-gray-400 text-md">
            {`Created: ${project.createdAt.toDateString()} - Last updated: ${project.updatedAt.toDateString()}`}
          </p>
          <hr></hr>
          <div className="flex flex-col container w-5/6 text-left gap-2 mb-2">
            <h2 className="text-2xl font-bold">Description</h2>
            <p className="text-lg">{project.description}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col container w-5/6 text-left gap-2 mb-2">
            <h2 className="text-2xl font-bold">Requirements</h2>
            <p className="text-lg">{project.requirements}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col container w-5/6 text-left gap-2 mb-2">
            <h2 className="text-2xl font-bold">Suggestions</h2>
            <p className="text-lg">{project.suggestions}</p>
          </div>
          {project.additional && (
            <>
              <hr></hr>
              <div className="flex flex-col container w-5/6 text-left gap-2 mb-2">
                <h2 className="text-2xl font-bold">Additional info</h2>
                <p className="text-lg">{project.additional}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}