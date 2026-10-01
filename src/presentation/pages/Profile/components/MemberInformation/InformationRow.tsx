const InformationRow = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="flex items-center justify-between leading-5 gap-1">
            <span className="text-neutral-950 text-sm">{label}</span>
            <span className="font-semibold text-end">{value}</span>
        </div>
    )
}

export default InformationRow