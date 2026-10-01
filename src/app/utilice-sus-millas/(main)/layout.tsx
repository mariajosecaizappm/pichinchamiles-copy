import StickyNavWrapper from "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper";
import HomeTabs from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs";

type Props = {
    children: React.ReactNode;
    categories: React.ReactNode;
    subnav: React.ReactNode;
}

const UtiliceSusMillasMainLayout = ({
    children,
    categories,
    subnav,
}: Props) => {
    return (
        <>
            <div className="p-4 md:hidden">
                <div className="w-full max-w-72 mx-auto">
                    <HomeTabs />
                </div>
            </div>

            <StickyNavWrapper className="md:hidden sticky top-0 z-50 bg-white">
                <div className="w-full overflow-x-auto">
                    {categories}
                </div>
            </StickyNavWrapper>

            <StickyNavWrapper className="hidden md:block md:sticky top-0 z-50 lg:mt-2 bg-white">
                <nav className="flex flex-row items-center gap-x-6 body-container py-4">
                    <div className="flex shrink-0 whitespace-nowrap flex-1 max-w-129">
                        <div className="flex flex-col w-full">
                            <div className="w-full max-w-72 mx-auto">
                                <HomeTabs />
                            </div>
                            {subnav}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto flex flex-1 min-w-0">
                        {categories}
                    </div>
                </nav>
            </StickyNavWrapper>

            <main>{children}</main>
        </>
    );
}

export default UtiliceSusMillasMainLayout;
