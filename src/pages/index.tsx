import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "flowbite-react"
import { useRouter } from "next/router";

export default function Start() {
  const user = useUser();
  const router = useRouter();
  if (user.isSignedIn) {
    void router.push("/home");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <section className="container flex flex-col items-center justify-center gap-12 px-4 py-15">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            ProjectHub
          </h1>
          <p className="text-2xl text-white">
            Share project ideas, <b>build</b> your way out of junior
          </p>
          {!user.isSignedIn &&  <Button gradientDuoTone="greenToBlue"><SignInButton /></Button>}
        </section>
        <div className="container flex">
          <section className="container flex flex-col items-center justify-center py-10">
            <h2 className="font-bold sm:text-[3rem]">Post your ideas</h2>
            <ul className="flex flex-col gap-3 py-3">
              <li>Add structured descriptions to your software projects</li>
              <li>Provide guidance to aspiring developers in need</li>
              <li>Become part of a community of developers</li>
            </ul>
          </section>
          <section className="container flex flex-col items-center justify-center py-10">
            <h2 className="font-bold sm:text-[3rem]">Build different projects</h2>
            <ul className="flex flex-col gap-3 py-3">
              <li>Browse through exiting project ideas based on your interests</li>
              <li>Gain valuable experience through project-driven development</li>
              <li>Add value to your software portfolio</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
