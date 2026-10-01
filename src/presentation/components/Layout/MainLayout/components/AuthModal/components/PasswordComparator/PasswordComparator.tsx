import FormContext from '@/presentation/components/Form/context/FormContext';
import Icon from '@/presentation/components/icons/Icon';
import React, { useContext } from 'react';

export interface Rule {
    label: string;
    test: (pwd: string) => boolean;
    announcement: string;
}

interface PasswordComparatorProps {
    name: string;
    rules: Rule[];
}

const PasswordComparator: React.FC<PasswordComparatorProps> = ({ name, rules }) => {
    const { values } = useContext(FormContext);
    const password = (values[name] as string) || '';

    return (
        <div className="flex flex-col gap-2">
            {rules.map((rule) => {
                const isValid = rule.test(password);
                
                return <div key={rule.label} className="flex items-center gap-2">
                    <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                        {isValid ? (
                            <Icon name="icon-check" className="text-success-500 w-5 h-5" aria-hidden="true" />
                        ) : (
                            <Icon name="icon-dash" className="text-grayscale-500 w-4 h-4" aria-hidden="true" />
                        )}
                    </div>
                    <span className="typo-main-legal-medium text-grayscale-500">
                        {rule.label}
                    </span>
                </div>
            })}
        </div>
    );
};

export default PasswordComparator;
