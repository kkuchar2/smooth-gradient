'use client';

import React, { useState } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { MoveRight } from 'lucide-react';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { GradientSlider } from '@/components/GradientSlider/GradientSlider';
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

    const [gradient] = generateGradient(startColor, stopColor, stops, mean, stdDev);

    const onCheckedChange = (checked: CheckedState) => {
        setBackgroundRepeatEnabled(typeof checked === 'boolean' ? checked : false);
    };

    const onDirectionClick = () => {
        const currentStartColor = startColor;
        setStartColor(stopColor);
        setStopColor(currentStartColor);
        setDirection(direction === 'to right' ? 'to left' : 'to right');
    };

    return (
        <main className={'flex min-h-screen flex-col items-center justify-between p-24'}>

            <div className={styles.container}>
                <div className={'m-3 text-center font-mono text-2xl tracking-tight'}>{'Smooth gradient generator'}</div>
                <div className={'flex flex-col p-8'}>
                    <div className={'flex gap-6'}>
                        <div className={'flex w-[350px] flex-col'}>
                            <div className={'flex items-center gap-3 pb-6'}>
                                <ColorPicker color={startColor} setColor={setStartColor}/>
                                <MoveRight className={'size-6 cursor-pointer text-white'}
                                    onClick={onDirectionClick}/>
                                <ColorPicker color={stopColor} setColor={setStopColor}/>
                            </div>
                            <GradientSlider
                                title={`Standard deviation: ${stdDev}`}
                                min={stdDevMin}
                                max={stdDevMax}
                                defaultValue={0.2}
                                step={0.01}
                                onValueChange={setStdDev}
                                onReset={() => setStdDev(0.2)}/>
                            <GradientSlider
                                title={`Mean: ${mean}`}
                                min={-2}
                                max={10}
                                step={0.01}
                                defaultValue={0}
                                onValueChange={setMean}
                                onReset={() => setMean(0)}/>
                            <GradientSlider
                                title={`Stops: ${stops}`}
                                min={1}
                                max={200}
                                step={1}
                                defaultValue={50}
                                onValueChange={setStops}
                                onReset={() => setStops(50)}/>
                            <GradientSlider
                                title={`Position X: ${positionX}cqw`}
                                min={-100}
                                max={100}
                                step={1}
                                defaultValue={0}
                                onValueChange={setPositionX}
                                onReset={() => setPositionX(0)}/>
                            <GradientSlider
                                title={`Position Y: ${positionY}cqw`}
                                min={-100}
                                max={100}
                                step={1}
                                defaultValue={0}
                                onValueChange={setPositionY}
                                onReset={() => setPositionY(0)}/>
                            <GradientSlider
                                title={`Opacity: ${opacity}`}
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={1}
                                onValueChange={setOpacity}
                                onReset={() => setOpacity(1)}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <div style={{
                                position: 'relative',
                                mixBlendMode: 'lighten',
                                backgroundPositionX: `${positionX}cqw`,
                                backgroundPositionY: `${positionY}cqw`,
                                backgroundRepeat: backgroundRepeatEnabled ? 'repeat' : 'no-repeat',
                                backgroundImage: gradient,
                                width: '60cqw',
                                height: '60cqw',
                                opacity: opacity
                            }}/>
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
                        </div>
                    </div>
                </div>
                <div
                    className={'w-full overflow-y-auto border-none bg-none p-5 text-sm tracking-tighter text-white shadow-none'}>
                    {gradient}
                </div>

            </div>
        </main>
    );
}
