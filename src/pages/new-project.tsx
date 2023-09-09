import { useUser } from "@clerk/nextjs";
import { Button } from "flowbite-react";
import Head from "next/head";
import Nav from "~/components/Nav";

export default function NewProject() {
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
        <div className="flex flex-col items-center justify-center h-1/2 w-2/5 bg-stone-800 text-white rounded-lg px-8 py-4 my-8">
          <h1 className="text-3xl font-bold pb-4">Submit a new project idea</h1>
          <hr></hr>
          <form className="flex flex-col items-start justify-start w-full h-1/2">
            <fieldset className="flex flex-col gap-2 w-full mb-7">
              <label htmlFor="title" className="text-2xl font-semibold">Title</label>
              <input required type="text" name="title" id="title" className="w-full h-8 bg-stone-800 text-white rounded-lg py-3" />
            </fieldset>
            <fieldset className="flex flex-col gap-2 w-full mb-7">
              <label htmlFor="description" className="text-2xl font-semibold">Description</label>
              <textarea required name="description" id="description" className="w-full h-28 bg-stone-800 text-white rounded-lg py-3" />
            </fieldset>
            <fieldset className="flex flex-col gap-2 w-full mb-7">
              <label htmlFor="requirements" className="text-2xl font-semibold">Requirements</label>
              <textarea required name="requirements" id="requirements" className="w-full h-28 bg-stone-800 text-white rounded-lg py-3" />
            </fieldset>
            <fieldset className="flex flex-col gap-2 w-full mb-7">
              <label htmlFor="suggestions" className="text-2xl font-semibold">Suggestions</label>
              <textarea required name="suggestions" id="suggestions" className="w-full h-28 bg-stone-800 text-white rounded-lg py-3" />
            </fieldset>
            <fieldset className="flex flex-col gap-2 w-full mb-7">
              <label htmlFor="additional" className="text-2xl font-semibold">Additional details (optional)</label>
              <textarea name="additional" id="additional" className="w-full h-28 bg-stone-800 text-white rounded-lg py-3" />
            </fieldset>
            <Button type="submit" gradientDuoTone="purpleToBlue" className="mx-auto">Submit</Button>
          </form>
        </div>
      </main>
    </>
  );
}