import React from 'react';
import { conditionsTravelCopago } from '../data/conditionsTravelCopago';

const TravelsCopagoRedemptionSection: React.FC = () => {
    return (
        <div className="mb-4 base-paragraph font-medium leading-body-dropdown text-dropdown">
            {conditionsTravelCopago.map((section, index) => {
                const sectionKey = `section-${index}`;
                return (
                    <div key={sectionKey} className="mb-6">
                        <p className="mb-3">{section.title}</p>
                        {section.content.map((paragraph, pIndex) => {
                            const paragraphKey = `paragraph-${pIndex}`;
                            return (
                                <p key={paragraphKey} className="pl-4 mb-3">{paragraph}</p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default TravelsCopagoRedemptionSection;
