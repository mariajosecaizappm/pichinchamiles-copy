export interface EmbeddedListItem {
    content: string;
    subList?: string[];
}

export interface EmbeddedListProps {
    items: EmbeddedListItem[];
    type?: "ul" | "ol";
    className?: string;
    subListClassName?: string;
}