import clsx from "clsx";

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={clsx("w-6 h-6 md:w-9 md:h-6", className)}
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default MenuIcon;