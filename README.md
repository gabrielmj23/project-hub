# ProjectHub

A NextJS site to share project ideas and level up your coding game, geared towards devs looking to gain new skills by building creative projects.

Built with the [T3 Stack](https://create.t3.gg/), using NextJS, Clerk, Prisma, Tailwind CSS, Flowbite and tRPC.

## Features

- Log in with GitHub or Google
- Browse project ideas and filter by search terms and tags
- See user's posted ideas on their profiles
- Create your own project ideas following a simple set of guidelines
- Get AI help to write your project ideas, using the [Google flan-t5-xxl](https://huggingface.co/google/flan-t5-xxl) model

## Limitations

- Still very much a WIP
- Can't get a DB host just yet, so host your own ProjectHub for now
- The AI helper is not that good :(

## Hosting your own

1. Clone the repo
2. Add a project on your Clerk account and add your env variables to a .env file (see [.env.example](.env.example))
3. Start a MySQL database and add the connection string to your .env file
4. Run `pnpm install` to install dependencies, and `pnpm exec prisma migrate dev` to run migrations
5. Run `pnpm dev` to start the dev server
