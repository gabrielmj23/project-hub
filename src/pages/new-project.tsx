import { useUser } from "@clerk/nextjs";
import { type Tag } from "@prisma/client";
import { Button } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
  const [project, setProject] = useState({
    title: "",
    description: "",
    requirements: "",
    suggestions: "",
    additional: "",
    tags: [] as Tag[],
  });
  const [tagsVisible, setTagsVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault();
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();
  const tagsList = api.tags.getAll.useQuery().data;
  const groupedTags: Record<string, Tag[]> = {};
  if (tagsList) {
    tagsList.forEach((tag) => {
      if (groupedTags[tag.type]) {
        groupedTags[tag.type]?.push(tag);
      } else {
        groupedTags[tag.type] = [tag];
      }
    });
  }
  const { mutate, isLoading } = api.projects.create.useMutation({
    onSuccess: async () => {
      await router.push("/home");
    },
  });

  return (
    <form
      className="flex h-1/2 w-full flex-col items-start justify-start"
      onSubmit={(e) => {
        e.preventDefault();
        mutate(project);
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
          value={project.title}
          name="title"
          id="title"
          className="h-8 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={handleChange}
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
          value={project.description}
          name="description"
          id="description"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={handleChange}
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
          value={project.requirements}
          name="requirements"
          id="requirements"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={handleChange}
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
          value={project.suggestions}
          name="suggestions"
          id="suggestions"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={handleChange}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <label htmlFor="additional" className="text-2xl font-semibold">
          Additional details (optional)
        </label>
        <textarea
          autoComplete="false"
          disabled={isLoading}
          value={project.additional}
          name="additional"
          id="additional"
          className="h-28 w-full rounded-lg bg-stone-800 py-3 text-white"
          onChange={handleChange}
        />
      </fieldset>
      <fieldset className="mb-7 flex w-full flex-col gap-2">
        <div className="flex flex-row items-center gap-3">
          <label htmlFor="addTags" className="text-2xl font-semibold">
            Add tags
          </label>
          <input
            className="rounded"
            type="checkbox"
            id="addTags"
            name="addTags"
            onChange={(_) => setTagsVisible(!tagsVisible)}
          />
        </div>
        {Object.entries(groupedTags).map(([type, tags]) => (
          <div
            key={type}
            className={`flex flex-col gap-3 ${tagsVisible ? "" : "hidden"}`}
          >
            <p className="text-lg">{type}</p>
            <div className="grid grid-cols-5 gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="flex flex-row items-center gap-3">
                  <input
                    className="rounded"
                    type="checkbox"
                    id={tag.id}
                    name={tag.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProject({
                          ...project,
                          tags: [...project.tags, tag],
                        });
                      } else {
                        setProject({
                          ...project,
                          tags: project.tags.filter((t) => t !== tag),
                        });
                      }
                    }}
                  />
                  <label htmlFor={tag.id}>{tag.name}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </fieldset>
      <Button
        type="submit"
        disabled={isLoading}
        gradientDuoTone="purpleToBlue"
        className="mx-auto"
      >
        Submit
      </Button>
    </form>
  );
}
