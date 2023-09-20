import { useUser } from "@clerk/nextjs";
import { HfInference, type TextGenerationOutput } from "@huggingface/inference";
import { type Tag } from "@prisma/client";
import { Button } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Nav from "~/components/Nav";
import { env } from "~/env.mjs";
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
  const [aiLoading, setAILoading] = useState(false);

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

  // Group tags by type
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

  const handleAIClick = async () => {
    const hf = new HfInference(env.NEXT_PUBLIC_HUGGING_FACE_KEY);
    let title = project.title.trim();
    if (title === "") {
      // Generate project title
      try {
        title = (
          await hf.textGeneration({
            model: "google/flan-t5-xxl",
            inputs:
              "Write a short and precise title describing a software development project idea of your own, take for examples: 'Build a Facebook clone' and 'Code a time-tracking mobile app'. Keep it safe and creative",
            parameters: {
              temperature: 1.01,
              top_k: 20,
            },
          })
        ).generated_text;
      } catch (e) {
        return;
      }
    }
    // Generate rest of project
    const FIELDS = ["description", "requirements", "suggestions"];
    const hfResults = await Promise.allSettled([
      hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs:
          "Write a clear and helpful description of a software development project based on the title: " +
          title,
        parameters: {
          temperature: 1.02,
        },
      }),
      hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs:
          "Write a numbered list of specific and creative requirements for a software development project based on the title: " +
          title,
        parameters: {
          temperature: 1.02,
        },
      }),
      hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs:
          "Write a numbered list of helpful suggestions, tools and techniques to fulfill all possible requirements for a software development project based on the title: " +
          title,
        parameters: {
          temperature: 1.02,
        },
      }),
    ]);
    // Set project fields
    const generatedProject = Object.fromEntries(
      FIELDS.map((field, i) => {
        return [
          field,
          hfResults[i]?.status === "fulfilled"
            ? (hfResults[i] as PromiseFulfilledResult<TextGenerationOutput>)
                .value.generated_text
            : "Something went wrong...",
        ];
      }),
    );
    setProject({
      ...project,
      title,
      ...generatedProject,
    });
  };

  return (
    <div className="flex h-1/2 w-full flex-col gap-5">
      <Button
        className="mx-auto w-1/4"
        disabled={aiLoading}
        gradientDuoTone="purpleToPink"
        type="button"
        onClick={async () => {
          setAILoading(true);
          await handleAIClick();
          setAILoading(false);
        }}
        onKeyPressed={handleAIClick}
      >
        Get AI help ✨
      </Button>
      <form
        className="flex flex-col items-start justify-start"
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
                  <div
                    key={tag.id}
                    className="flex flex-row items-center gap-3"
                  >
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
          size="lg"
          disabled={isLoading}
          gradientDuoTone="purpleToBlue"
          className="mx-auto w-1/4"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
