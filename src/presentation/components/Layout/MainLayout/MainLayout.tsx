import React, {ReactNode} from "react"
import dynamic from "next/dynamic"
import Header from "@/presentation/pages/Home/components/Header"
import Footer from "@/presentation/pages/Home/components/Footer"
import DeferredInitializers from "@/presentation/components/Layout/MainLayout/DeferredInitializers"

const AuthModal = dynamic(() => import("@/presentation/components/Layout/MainLayout/components/AuthModal"))
const LopdModal = dynamic(() => import("@/presentation/components/Layout/MainLayout/components/LopdModal"))

type Props = {
    children: ReactNode
}

const MainLayout: React.FC<Props> = ({children}) => {
    return (
        <div className="bg-linear-to-br from-white to-white flex items-center justify-center typo-main-body-book">
            <AuthModal/>
            <LopdModal/>
            <div className="w-full min-h-screen flex flex-col justify-between self-stretch">
                <Header/>
                <div className="flex-1">
                    {children}
                </div>
                <Footer/>
                <DeferredInitializers/>
            </div>
        </div>
    )
}

export default MainLayout
