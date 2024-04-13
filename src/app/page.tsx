'use client';

import React, { useState } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { MoveRight } from 'lucide-react';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { Slider } from '@/components/Slider/Slider';
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview';
import { Checkbox } from '@/components/ui/checkbox';
import styles from '@/styles/Index.module.scss';

const pi = 3.14159;
const e = 2.718;

function hex2rgba(color1: string) {
    const v = color1.match(/\w\w/g);

    if (!v) {
        throw new Error('Invalid color');
    }

    return v.map(hex => parseInt(hex, 16));
}

function d2h(d: number) {
    return d.toString(16);
}

const mix = function (color_1: string, color_2: string, weight: number) {

    let color = '#';

    const rgba1 = hex2rgba(color_1);
    const rgba2 = hex2rgba(color_2);

    for (let i = 0; i < 3; i++) { // loop through each of the 3 hex pairs—red, green, and blue
        const v1 = rgba1[i];
        const v2 = rgba2[i];

        let val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        while (val.length < 2) {
            val = '0' + val;
        } // prepend a '0' if val results in a single digit

        color += val; // concatenate val to our new color string
    }

    return color; // PROFIT!
};

function gaussian(x: number, mean: number, stddev: number) {
    // Calculate the factor
    const factor = 1 / (stddev * Math.sqrt(2 * pi));

    // Calculate the exponent
    const exponent = -0.5 * Math.pow((x - mean) / stddev, 2);

    // Return the Gaussian value
    return factor * Math.pow(e, exponent);
}

function generateGradient(startColor: string, endColor: string, stops: number, mean: number, stddev: number): [string, number[]] {
    // 1. Calculate weights based on Gaussian curve
    let weights = [] as number[];
    for (let i = 0; i < stops; i++) {
        const x = i / stops;
        const weight = gaussian(x, mean, stddev);
        weights.push(weight);
    }

    // 2. Calculate scaling factor to fit weights within 0 to 100 (range required by mix)
    const maxWeight = Math.max(...weights);
    const scaleFactor = 100 / maxWeight;

    // 3. Calculate next color based on weights
    let gradient = '';
    let i = 0;

    weights.forEach(weight => {
        // Scale the weight to fit within 0 to 100
        const scaledWeight = weight * scaleFactor;

        // Calculate the current color, round scaleWeight to 2 decimal places
        const currentColor = mix(startColor, endColor, scaledWeight);

        // Add the stop to the gradient
        if (i === 0) {
            gradient += currentColor + ' 0%';
        }
        else {
            const percent = (i / stops) * 100;
            const percentRounded = Math.round(percent * 100) / 100;
            gradient += `, ${currentColor} ${percentRounded}%`;
        }

        // Increment the stop
        i++;
    });

    // 4. Output the gradient
    return [`radial-gradient(${gradient})`, weights];
}

const stdDevMin = 0;
const stdDevMax = 1;

const defaultStopColor = '#14151A';
const defaultStartColor = '#a05151';

const noise = 'data:image/png;base64,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';

export default function Home() {

    const [startColor, setStartColor] = useState(defaultStartColor);
    const [stopColor, setStopColor] = useState(defaultStopColor);

    const [stdDev, setStdDev] = React.useState(0.20);
    const [mean, setMean] = React.useState(0);
    const [stops, setStops] = React.useState(50);
    const [positionX, setPositionX] = React.useState(0);
    const [positionY, setPositionY] = React.useState(0);
    const [backgroundRepeatEnabled, setBackgroundRepeatEnabled] = React.useState(true);
    const [direction, setDirection] = React.useState('to right');
    const [opacity, setOpacity] = React.useState(1);
    const [enableDither, setEnableDither] = React.useState(true);

    const [gradient] = generateGradient(startColor, stopColor, stops, mean, stdDev);

    const onCheckedChange = (checked: CheckedState) => {
        setBackgroundRepeatEnabled(typeof checked === 'boolean' ? checked : false);
    };

    const onEnableDitherChange = (checked: CheckedState) => {
        setEnableDither(typeof checked === 'boolean' ? checked : false);
    };

    const onDirectionClick = () => {
        const currentStartColor = startColor;
        setStartColor(stopColor);
        setStopColor(currentStartColor);
        setDirection(direction === 'to right' ? 'to left' : 'to right');
    };

    const gradientStyle = {
        position: 'relative',
        mixBlendMode: 'lighten',
        backgroundPositionX: `${positionX}cqw`,
        backgroundPositionY: `${positionY}cqw`,
        backgroundRepeat: backgroundRepeatEnabled ? 'repeat' : 'no-repeat',
        backgroundImage: gradient,
        mask: enableDither ? `url(${noise}), radial-gradient(rgba(0,0,0,1), rgba(0,0,0,0.2))` : 'none',
        width: '60cqw',
        height: '60cqw',
        opacity: opacity
    } as React.CSSProperties;

    const styleasStr = JSON.stringify(gradientStyle, null, 2);

    return (
        <main className={'flex min-h-screen flex-col items-center justify-between p-24'}>

            <div className={styles.container}>
                <div
                    className={'m-3 text-center font-mono text-2xl tracking-tight'}>{'Gaussian gradient generator'}</div>
                <div className={'flex flex-col p-8'}>
                    <div className={'flex gap-6'}>
                        <div className={'flex w-[350px] flex-col'}>
                            <div className={'flex items-center gap-3 pb-6'}>
                                <ColorPicker color={startColor} setColor={setStartColor}/>
                                <MoveRight className={'size-6 cursor-pointer text-white'}
                                    onClick={onDirectionClick}/>
                                <ColorPicker color={stopColor} setColor={setStopColor}/>
                            </div>
                            <Slider
                                title={`Standard deviation: ${stdDev}`}
                                min={stdDevMin}
                                max={stdDevMax}
                                defaultValue={0.2}
                                step={0.01}
                                onValueChange={setStdDev}
                                onReset={() => setStdDev(0.2)}/>
                            <Slider
                                title={`Mean: ${mean}`}
                                min={-2}
                                max={10}
                                step={0.01}
                                defaultValue={0}
                                onValueChange={setMean}
                                onReset={() => setMean(0)}/>
                            <Slider
                                title={`Stops: ${stops}`}
                                min={1}
                                max={200}
                                step={1}
                                defaultValue={50}
                                onValueChange={setStops}
                                onReset={() => setStops(50)}/>
                            <Slider
                                title={`Position X: ${positionX}cqw`}
                                min={-100}
                                max={100}
                                step={1}
                                defaultValue={0}
                                onValueChange={setPositionX}
                                onReset={() => setPositionX(0)}/>
                            <Slider
                                title={`Position Y: ${positionY}cqw`}
                                min={-100}
                                max={100}
                                step={1}
                                defaultValue={0}
                                onValueChange={setPositionY}
                                onReset={() => setPositionY(0)}/>
                            <Slider
                                title={`Opacity: ${opacity}`}
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={1}
                                onValueChange={setOpacity}
                                onReset={() => setOpacity(1)}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <div style={gradientStyle}/>
                            <div className={'flex items-center justify-end gap-4'}>
                                <div className={'flex items-center justify-end space-x-2'}>
                                    <Checkbox id={'terms1'} className={'size-6'} checked={backgroundRepeatEnabled}
                                        onCheckedChange={onCheckedChange}/>
                                    <div className={'grid gap-1.5 leading-none'}>
                                        <label
                                            htmlFor={'terms1'}
                                            className={'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}
                                        >
                                            {'Background repeat'}
                                        </label>
                                    </div>
                                </div>
                                <div className={'flex items-center justify-end space-x-2'}>
                                    <Checkbox id={'terms1'} className={'size-6'} checked={enableDither}
                                        onCheckedChange={onEnableDitherChange}/>
                                    <div className={'grid gap-1.5 leading-none'}>
                                        <label
                                            htmlFor={'terms1'}
                                            className={'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}
                                        >
                                            {'Enable dither'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={'w-full max-w-full overflow-y-auto border-none bg-none p-5 text-sm tracking-tighter text-white shadow-none'}>
                    <SourceCodePreview sourceCode={styleasStr}/>
                </div>
            </div>
        </main>
    );
}
