import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Button from "~/components/Button";

export default function Start() {
  const user = useUser();

  return (
    <>
      <Head>
        <title>ProjectHub</title>
        <meta name="description" content="Share project ideas, build your way out of junior" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <section className="container flex flex-col items-center justify-center gap-12 px-4 py-15">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            ProjectHub
          </h1>
          <p className="text-2xl text-white">
            Share project ideas, <b>build</b> your way out of junior
          </p>
          {!user.isSignedIn &&  <Button classes="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"><SignInButton /></Button>}
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
