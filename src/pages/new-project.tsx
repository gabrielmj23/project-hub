import { useUser } from "@clerk/nextjs";
import { Button } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";

export default function NewProject() {
  const user = useUser();
  if (!user || !user.isSignedIn || !user.isLoaded) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create a project idea</title>
      </Head>
      <Nav imageUrl={user.user.imageUrl} username={user.user.username ?? ""} />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="my-8 flex h-1/2 w-2/5 flex-col items-center justify-center rounded-lg bg-stone-800 px-8 py-4 text-white">
          <h1 className="pb-4 text-3xl font-bold">Submit a new project idea</h1>
          <hr></hr>
          <ProjectForm />
        </div>
      </main>
    </>
  );
}

function ProjectForm() {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [additional, setAdditional] = useState("");

  const router = useRouter();
  const { mutate, isLoading } = api.projects.create.useMutation({
    onSuccess: async () => {
      await router.push("/home");
    }
  });

  return (
    <form
      className="flex h-1/2 w-full flex-col items-start justify-start"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ title, description, requirements, suggestions, additional });
      }}
    >
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="title" className="text-2xl font-semibold">
          Title
        </label>
        <input
          required
          autoComplete="false"
          disabled={isLoading}
          type="text"
          value={title}
          name="title"
          id="title"
          className="h-8 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={(e) => setTitle(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="description" className="text-2xl font-semibold">
          Description
        </label>
        <textarea
          required
          autoComplete="false"
          disabled={isLoading}
          value={description}
          name="description"
          id="description"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={(e) => setDescription(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="requirements" className="text-2xl font-semibold">
          Requirements
        </label>
        <textarea
          required
          autoComplete="false"
          disabled={isLoading}
          value={requirements}
          name="requirements"
          id="requirements"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={(e) => setRequirements(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="suggestions" className="text-2xl font-semibold">
          Suggestions
        </label>
        <textarea
          required
          autoComplete="false"
          disabled={isLoading}
          value={suggestions}
          name="suggestions"
          id="suggestions"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={(e) => setSuggestions(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="additional" className="text-2xl font-semibold">
          Additional details (optional)
        </label>
        <textarea
          autoComplete="false"
          disabled={isLoading}
          value={additional}
          name="additional"
          id="additional"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={(e) => setAdditional(e.target.value)}
        />
      </fieldset>
      <Button type="submit" disabled={isLoading} gradientDuoTone="purpleToBlue" className="mx-auto">
        Submit
      </Button>
    </form>
  );
}
