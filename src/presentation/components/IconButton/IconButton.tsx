import React, {FC, ReactNode} from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = {
    children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: FC<IconButtonProps> = ({children, className, ...rest}) => {
    return (
        <button className={`${styles.iconButton} ${className}`} {...rest}>
            {children}
        </button>
    );
};

export default IconButton;