import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

const LeftArrow = () => {
    const { scrollPrev, useIsVisible } = useContext(VisibilityContext);
    const isFirstItemVisible = useIsVisible("first", true);

    return (
        <button
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-information-500 w-8 h-8 flex items-center justify-center cursor-pointer disabled:hidden"
            onClick={() => scrollPrev()}
            disabled={isFirstItemVisible}
            aria-label="Scroll left"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2021 19.2482L15.6242 20.8261L6.7983 12.0002L15.6242 3.17432L17.2021 4.75228L9.95416 12.0002L17.2021 19.2482Z" fill="currentColor" />
            </svg>
        </button>
    );
};

export default LeftArrow;