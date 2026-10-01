import { Button } from "@heroui/react"


type Props = {
    showAll: boolean;
    setShowAll: (showAll: boolean) => void;
}

const ShowAllFilters = ({ showAll, setShowAll }: Props) => {
    return (
        <div>
            <Button
                onPress={() => setShowAll(!showAll)}
                endContent={
                    <div className={showAll ? "rotate-180" : ""}>
                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.175 0L5 3.81667L8.825 0L10 1.175L5 6.175L0 1.175L1.175 0Z" fill="currentColor" />
                        </svg>
                    </div>
                }
                className="h-8 pr-2 pl-3 text-information-500 rounded-lg data-[hover=true]:bg-information-50 font-medium" variant="light">
                <span className="pl-1">
                    {
                        showAll ? "Ver menos" : "Ver todos"
                    }
                </span>
            </Button>
        </div>
    )
}

export default ShowAllFilters