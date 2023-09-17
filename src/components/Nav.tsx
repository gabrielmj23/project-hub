import { SignOutButton } from "@clerk/nextjs"
import { Dropdown, Navbar } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"

export default function Nav({ imageUrl, username }: { imageUrl: string, username: string }) {
  return (
    <Navbar fluid className="bg-stone-800 text-white">
      <Navbar.Brand href="/home">
        <span className="self-center whitespace-nowrap text-2xl font-semibold">ProjectHub</span>
      </Navbar.Brand>
      <div className="flex">
        <Dropdown 
          inline 
          label={<Image width="48" height="48" className="w-12 h-12 rounded-full" alt="Your profile picture" src={imageUrl} />}
          className="bg-stone-800 border-slate-800"
        >
          <Dropdown.Header>
            <span className="block truncate text-sm text-slate-100 font-semibold">{username}</span>
          </Dropdown.Header>
          <Dropdown.Item className="text-slate-100 hover:text-stone-800">
            <Link href={`/users/${username}`}>Profile</Link>
          </Dropdown.Item>
          <Dropdown.Item className="text-red-700">
            <SignOutButton />
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  )
}