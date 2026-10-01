import React from 'react';
import List from '@/presentation/components/List';
import clsx from 'clsx';
import type { EmbeddedListProps } from './types';

const EmbeddedList: React.FC<EmbeddedListProps> = ({ items, className = '', type = 'ul', subListClassName = '' }:EmbeddedListProps) => {
    const Component = type;

    return (
        <div className={className}>
            {items.map((item, index) => {
                const keyItem = `list-item-${index}`;
                return (
                    <Component
                        className={clsx( type === "ul" ? "list-disc pl-10 my-0" : "list-decimal ml-1.75 my-0",className)}
                        key={keyItem}>
                        <li className="base-paragraph">{item.content}
                            {item.subList && (
                                <List 
                                    items={item.subList} 
                                    type="ul" 
                                    className={clsx("base-paragraph ml-6 list-[circle]! mb-0", subListClassName)} 
                                />
                            )}
                        </li>
                    </Component>
                );
            })}
        </div>
    );
};

export default EmbeddedList;
