import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

const RightArrow = () => {
    const { scrollNext, useIsVisible } = useContext(VisibilityContext);
    const isLastItemVisible = useIsVisible("last", false);

    return (
        <button
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-information-500 w-8 h-8 flex items-center justify-center cursor-pointer disabled:hidden"
            onClick={() => scrollNext()}
            disabled={isLastItemVisible}
            aria-label="Scroll right"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.79785 19.2482L8.37582 20.8261L17.2017 12.0002L8.37582 3.17432L6.79785 4.75228L14.0458 12.0002L6.79785 19.2482Z" fill="currentColor" />
            </svg>
        </button>
    );
};

export default RightArrow;