import React from 'react';

import { Button } from '@/components/ui/button';
import { Slider as BaseSlider } from '@/components/ui/slider';

type SliderProps = {
    title: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onValueChange: (value: number) => void;
    onReset: () => void;
};

export const Slider = (props: SliderProps) => {

    const { title, min, max, step, defaultValue, onValueChange, onReset } = props;

    return <div className={'flex flex-col'}>
        <div className={'flex items-center justify-between'}>
            <div className={'font-mono'}>{title}</div>
            <Button variant={'outline'} className={'ml-4'} onClick={onReset}>
                {'Reset'}
            </Button>
        </div>
        <div className={'flex items-center gap-3 py-3 pr-3'}>
            <div className={'font-mono'}>{min}</div>
            <BaseSlider defaultValue={[defaultValue]} min={min} max={max} step={step}
                onValueChange={values => onValueChange(values[0])}
                className={'w-full'}/>
            <div className={'font-mono'}>{max}</div>
        </div>
    </div>;
};