import React from 'react';

export type IconName = 'icon-back-arrow' | 'icon-check' | 'icon-close' | 'icon-dash' | 'icon-error' | 'icon-house' | 'icon-info' | 'icon-arrow-cw' | 'icon-asset1' | 'icon-asset2' | 'icon-asset4' | 'icon-asset5' | 'icon-asset6' | 'icon-asset7' | 'icon-award' | 'icon-bag' | 'icon-bagpack' | 'icon-bag-travel' | 'icon-black-christmas' | 'icon-box1' | 'icon-box2' | 'icon-calendar2' | 'icon-car' | 'icon-card' | 'icon-card2' | 'icon-ccw' | 'icon-christmas' | 'icon-circle' | 'icon-clock' | 'icon-cme-servicios' | 'icon-cocktail' | 'icon-cog' | 'icon-computer' | 'icon-cw' | 'icon-desktop' | 'icon-dia-del-padre-bigote' | 'icon-disney' | 'icon-eco-tree' | 'icon-en-construccion' | 'icon-excel' | 'icon-flower' | 'icon-game' | 'icon-gift' | 'icon-globe' | 'icon-gplus1' | 'icon-grocery' | 'icon-headphones' | 'icon-health' | 'icon-help' | 'icon-home' | 'icon-home-menu' | 'icon-hotel' | 'icon-hotel-acomodacion' | 'icon-hotel-calendario' | 'icon-hotel-condiciones' | 'icon-hotel-incluye' | 'icon-hotel-no-incluye' | 'icon-hotel-plan-ejecutivo' | 'icon-hotel-plan-familiar' | 'icon-hotel-plan-pareja' | 'icon-hotels' | 'icon-hotel-tiempo' | 'icon-hotel-tooltip' | 'icon-hotel-vigencia' | 'icon-hueso' | 'icon-icon-avios' | 'icon-icon-comida' | 'icon-icon-hospitales' | 'icon-icono-dia-del-nino' | 'icon-icono-pqrs' | 'icon-icon-restaurantes' | 'icon-icon-sorvo-web' | 'icon-icon-unicef' | 'icon-joyeria' | 'icon-key' | 'icon-leaf' | 'icon-light-bulb' | 'icon-liquour' | 'icon-list' | 'icon-logistica-menu' | 'icon-magazine' | 'icon-marca-deportiva1' | 'icon-marca-deportiva2' | 'icon-marca-deportiva3' | 'icon-marca-deportiva4' | 'icon-megaphone' | 'icon-menu2' | 'icon-money1' | 'icon-no-pasar' | 'icon-paper-plane' | 'icon-pdf' | 'icon-perfume' | 'icon-phone' | 'icon-phone1' | 'icon-plane' | 'icon-propositos' | 'icon-recomendados' | 'icon-reportes-menu' | 'icon-ship' | 'icon-signal' | 'icon-soccer' | 'icon-spa' | 'icon-sports' | 'icon-tablet' | 'icon-target' | 'icon-teathre' | 'icon-th-large' | 'icon-th-list' | 'icon-ticket' | 'icon-time' | 'icon-trash-empty' | 'icon-tren' | 'icon-user' | 'icon-watch' | 'icon-word' | 'icon-success' | 'icon-back' | 'icon-shopping-bag' | 'icon-credit-card' | 'icon-local-offer' | 'icon-flight' | 'icon-local-mall' | 'icon-pets' | 'icon-library-books' | 'icon-arrow-down' | 'icon-arrow-right' | 'icon-priority-high' | 'icon-shopping-bag' | 'icon-arrow-back-ios' | 'icon-local-offer' | 'icon-flight' | 'icon-local-mall' | 'icon-pets' | 'icon-library-books' | 'icon-arrow-down' | 'icon-arrow-right' | 'icon-priority-high' | 'icon-arrow-back-ios';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    color?: string;
}

export const Icon = ({ name, size = 24, color = 'currentColor', width, height, ...props }: IconProps) => {
    return (
        <svg 
            width={width ?? size} 
            height={height ?? size} 
            fill={color} 
            {...props}
        >
            <use href={`/icons/sprite.svg#${name}`} />
        </svg>
    );
};

export default Icon;
