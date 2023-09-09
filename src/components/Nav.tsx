import { SignOutButton } from "@clerk/nextjs"
import { Dropdown, Navbar } from "flowbite-react"

export default function Nav({ imageUrl, username }: { imageUrl: string, username: string }) {
  return (
    <Navbar fluid className="bg-stone-800 text-white">
      <Navbar.Brand href="/home">
        <span className="self-center whitespace-nowrap text-2xl font-semibold">ProjectHub</span>
      </Navbar.Brand>
      <div className="flex">
        <Dropdown 
          inline 
          label={<img className="w-12 h-12 rounded-full" alt="User picture" src={imageUrl} />}
          className="bg-stone-800 border-slate-800"
        >
          <Dropdown.Header>
            <span className="block truncate text-sm text-slate-100 font-semibold">{username}</span>
          </Dropdown.Header>
          <Dropdown.Item className="text-slate-100 hover:text-stone-800">Profile</Dropdown.Item>
          <Dropdown.Item className="text-slate-100 hover:text-stone-800">Settings</Dropdown.Item>
          <Dropdown.Item className="text-red-700"><SignOutButton /></Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  )
}