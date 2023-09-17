import { Card } from "flowbite-react";
import Link from "next/link";

export default function PostCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={`/projects/${id}`}
      className="container max-w-3xl place-self-center"
    >
      <Card className="bg-zinc-800 hover:bg-zinc-700">
        <h5 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h5>
        <p className="font-normal text-gray-400">{description}</p>
      </Card>
    </Link>
  );
}
