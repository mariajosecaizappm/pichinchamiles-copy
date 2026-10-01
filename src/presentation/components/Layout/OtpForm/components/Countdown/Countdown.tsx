import React, {FC} from 'react';
import CountDown, {zeroPad} from "react-countdown";
import {useScreenReader} from "@/presentation/components/providers/ScreenReaderProvider";

type CountdownProps = {
    date: Date
    onComplete?: ()=> void
}

const Countdown: FC<CountdownProps> = ({date, onComplete}) => {
    const { info } = useScreenReader()

    return (
        <CountDown
            zeroPadTime={2}
            date={date}
            renderer={props => {
                return (
                    <>
                        {zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                    </>
                );
            }}
            onComplete={onComplete}
            onTick={props => {
                info(`${props.minutes} minutos y ${props.seconds} segundos restantes`)
            }}
        />
    );
};

export default Countdown;