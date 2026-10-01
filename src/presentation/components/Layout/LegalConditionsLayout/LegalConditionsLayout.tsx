import clsx from "clsx";
import type { LegalConditionsLayoutProps } from "./types";
import BreadcrumbForLayout from "../BreadcrumbForLayout/BreadcrumbForLayout";

const LegalConditionsLayout = ({
    title,
    children,
    showBreadcrumb = true,
    containerClassName= ""
}: LegalConditionsLayoutProps) => {
    return (
        <div data-testid="legal-conditions-layout" className="w-full py-6">
            <header className="my-5 lg:mb-10">
                <div data-testid="row" className="space-y-5 lg:space-y-10 base-container px-6">
                    {showBreadcrumb && <BreadcrumbForLayout items={[
                        {id:title, label:title,isCurrent:true}
                    ]} />}
                    <h2 className="base-h2 text-blue-500 text-center font-normal mt-2.5">{title}</h2>
                </div>
            </header>

            <main data-testid="col" className={clsx("base-container space-y-5 lg:space-y-10 px-6", containerClassName)}>{children}</main>
        </div>
    );
};

export default LegalConditionsLayout;