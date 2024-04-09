import React from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type GradientSliderProps = {
    title: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onValueChange: (value: number) => void;
    onReset: () => void;
};

export const GradientSlider = (props: GradientSliderProps) => {

    const { title, min, max, step, defaultValue, onValueChange, onReset } = props;

    return <div>
        <div className={'flex items-center justify-between p-3'}>
            <div className={'font-mono'}>{title}</div>
            <Button variant={'outline'} onClick={onReset}>
                {'Reset'}
            </Button>
        </div>
        <div className={'flex items-center justify-center gap-3 p-3'}>
            <div className={'font-mono'}>{min}</div>
            <Slider defaultValue={[defaultValue]} min={min} max={max} step={step}
                onValueChange={values => onValueChange(values[0])}
                className={'w-full'}/>
            <div className={'font-mono'}>{max}</div>
        </div>
    </div>;
};