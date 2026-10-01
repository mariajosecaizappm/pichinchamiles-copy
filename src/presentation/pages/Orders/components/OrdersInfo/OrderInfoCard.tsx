type OrderInfoCardProps = {
    icon: React.ReactNode
    text: string | React.ReactNode
}

const OrderInfoCard = ({
    icon,
    text
}: OrderInfoCardProps) => {
    return (
        <div className="py-3 px-4 flex gap-4 rounded-lg bg-darkGrayishBlue-100">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-2.5 relative aspect-square text-blue-500">
                {icon}
            </div>
            <span className="leading-6 text-[#4A4A4A]">
                {text}
            </span>
        </div>
    )
}

export default OrderInfoCard
