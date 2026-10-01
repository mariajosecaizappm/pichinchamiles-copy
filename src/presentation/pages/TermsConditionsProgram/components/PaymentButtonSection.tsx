import List from "@/presentation/components/List";
import { paymentButton } from '../data/paymentButton';

const PaymentButtonSection: React.FC = () => (
    <List items={paymentButton} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" /> 
);

export default PaymentButtonSection;
