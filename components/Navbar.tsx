import Link from "next/link"

function Navbar({ isAuthenticated }: { isAuthenticated: boolean}) {
  return (
    <header className="flex flex-col lg:flex-row items-center justify-between">
        <Link className="text-primary font-bold text-2xl" href={''}>
            DSS
        </Link>
        <nav className="flex  items-center gap-8 text-gray-500 font-semibold">
            <Link className="hover:underline text-primary" href={'/profile'}>Profile</Link>
            <Link className="hover:underline text-primary" href={'/menu'}>Menu</Link>
            <Link className="hover:underline text-primary" href={'/about'}>About</Link>
            <Link className="hover:underline text-primary" href={'/contact-us'}>Contact</Link>
            {
                !isAuthenticated && <Link className="bg-card-foreground rounded-full text-white px-8 py-2 hover:underline" href={'/login'}>Login</Link>
            }
            
        </nav>
    </header>
  )
}

export default Navbar
