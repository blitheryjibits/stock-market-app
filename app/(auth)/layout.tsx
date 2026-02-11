
import Link from "next/link";
import Image from "next/image";

import { JSX } from "react";
const Layout: ({ children }: { children: React.ReactNode }) => JSX.Element = ({ children }) => {
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo flex gap-3">
                    <Image src="/assets/icons/stock-exchange-app.png" alt="StockWatch Logo" width={32} height={32} className="h-8 w-auto cursor-pointer"/>
                    <p className="text-xl font-bold text-gray-100">Market Marker</p>
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">
                    {children}
                </div>
            </section>       

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        StockTake turned my trading around. The insights and real-time data helped me make smarter decisions and boost my profits.
                    </blockquote>
                    <div className="flex flex-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">- Ethan Rite </cite>
                            <p className="max-md:text-xs text-gray-500">Retail Investor</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image 
                                    key={star}
                                    src="/assets/icons/star.svg"
                                    alt="star"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
                </div>

            </section>
        </main>
    )
}

export default Layout;