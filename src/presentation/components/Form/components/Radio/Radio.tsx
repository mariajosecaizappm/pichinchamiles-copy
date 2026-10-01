import { cn, Radio as HerouiRadio, RadioProps } from "@heroui/react"

type RadioComponentProps = RadioProps

const Radio = (props: RadioComponentProps) => {
    const { children, ...otherProps } = props;

    return (
        <HerouiRadio
            {...otherProps}
            classNames={{
                ...otherProps.classNames,
                base: cn("p-[14px] m-0", otherProps.classNames?.base),
                wrapper: cn("border border-grayscale-400 group-data-[hover-unselected=true]:bg-darkGrayishBlue-100 group-data-[selected=true]:border-information-500 group-data-[selected=true]:bg-information-500", otherProps.classNames?.wrapper),
                labelWrapper: cn("ms-[18px]", otherProps.classNames?.labelWrapper),
                label: cn("text-sm font-medium leading-5", otherProps.classNames?.label),
                control: cn("bg-white", otherProps.classNames?.control),
            }}
        >
            {children}
        </HerouiRadio>
    );
};

export default Radio
