import List from '@/presentation/components/List';
import { activitiesRedemption } from '../data/activitiesRedemption';

const ActivitiesRedemptionSection: React.FC = () => (
    <List items={activitiesRedemption} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" /> 
);

export default ActivitiesRedemptionSection;
