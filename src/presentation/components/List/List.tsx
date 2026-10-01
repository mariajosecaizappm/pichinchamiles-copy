import React from "react";
import clsx from "clsx";
import type { ListProps } from "./types";

const List = <T,>({
    items,
    type = "ul",
    className,
    itemClassName,
    renderItem,
}: ListProps<T>) => {
    const Component = type;

    return (
        <Component
            className={clsx(
                type === "ul" ? "list-disc pl-10 my-0" : "list-decimal ml-1.75 my-0",
                className,
            )}
        >
            {items.map((item, i) => {
                const keyItem = `list-item-${i}`;
                return (
                    <li
                        key={keyItem}
                        className={clsx(itemClassName)}
                        data-test-id={`list-item-${i}`}
                    >
                        {renderItem ? renderItem(item, i) : (item as React.ReactNode)}
                    </li>
                );
            })}
        </Component>
    );
};

export default List;