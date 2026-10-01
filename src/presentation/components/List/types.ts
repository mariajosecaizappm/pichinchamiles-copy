export type ListProps<T = React.ReactNode> = {
    items: T[];
    type?: "ul" | "ol";
    className?: string;
    itemClassName?: string;
    renderItem?: (item: T, index: number) => React.ReactNode;
};