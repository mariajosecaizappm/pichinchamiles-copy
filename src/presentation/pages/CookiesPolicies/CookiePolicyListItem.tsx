import React from 'react'


type CookiePolicyListItemProps = {
    title: string;
    description: string;
}

const CookiePolicyListItem = ({ title, description }: CookiePolicyListItemProps) => {
    return (
        <>
            <strong className='font-bold'>{title}</strong>: {description}
        </>
    )
}

export default CookiePolicyListItem