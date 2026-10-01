const ArrowButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button
        className="bg-white cursor-pointer w-10 h-10 border border-darkGrayishBlue-400 rounded-full flex items-center justify-center  text-helper-500 hover:bg-darkGrayishBlue-200 active:bg-darkGrayishBlue-400 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
        {...props}
    />
}

export default ArrowButton