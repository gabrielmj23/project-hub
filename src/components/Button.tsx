export default function Button({classes, children}: {classes: string, children: React.ReactNode}) {
  return (
    <button type="button" className={"font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 " + classes}>
      {children}
    </button>
  )
}