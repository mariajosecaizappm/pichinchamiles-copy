import CloseIcon from "./Icons/CloseIcon";

const CloseMenuButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button 
            onClick={onClick} 
            aria-label="Cerrar menú"
            className="self-start cursor-pointer flex items-center gap-2 text-blue-500">
            <span className="w-7 h-7 flex items-center justify-center" aria-hidden="true">
                <CloseIcon />
            </span>
            <span className="hidden md:flex items-center font-semibold text-xl leading-6">Cerrar</span>
        </button>
    );
};

export default CloseMenuButton;