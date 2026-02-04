import Header from "@/components/Header";
import { JSX } from "react";
const Layout: ({ children }: { children: React.ReactNode }) => JSX.Element = ({ children }) => {
    return (
        <main className="min-h-screen text-gray-400">
            <Header />
            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}

export default Layout;