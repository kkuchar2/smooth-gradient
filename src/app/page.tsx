'use client';

import React, { useState } from 'react';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { GradientSlider } from '@/components/GradientSlider/GradientSlider';
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

const defaultStopColor = '#0e1111';
const defaultStartColor = '#a05151';

export default function Home() {

    const [startColor, setStartColor] = useState(defaultStartColor);
    const [stopColor, setStopColor] = useState(defaultStopColor);

    const [stdDev, setStdDev] = React.useState(0.20);
    const [mean, setMean] = React.useState(0);
    const [stops, setStops] = React.useState(50);

    const [gradient] = generateGradient(startColor, stopColor, stops, mean, stdDev);

    return (
        <main className={'flex min-h-screen flex-col items-center justify-between p-24'}>

            <div className={styles.container}>
                <div
                    className={'m-3 text-center font-mono text-2xl tracking-tight'}>{'Smooth radial gradient generator'}</div>
                <div className={'p-8'}>
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
                        min={-1}
                        max={1}
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
                    <div className={'flex flex-col items-center justify-center gap-4 p-5 md:flex-row'}>
                        <div>{'Start color: '}</div>
                        <ColorPicker color={startColor} setColor={setStartColor}/>
                        <div>{'Stop color: '}</div>
                        <ColorPicker color={stopColor} setColor={setStopColor}/>
                    </div>
                </div>

                <div style={{
                    position: 'relative',
                    mixBlendMode: 'lighten',
                    backgroundImage: gradient,
                    width: '100cqw',
                    height: '100cqw',
                }}>
                    <div
                        className={'absolute left-[5%] top-[10px] h-[150px] max-h-[150px] w-[90%] overflow-y-auto border-none bg-none p-5 text-sm tracking-tighter text-white/50 shadow-none'}>
                        {gradient}
                    </div>
                </div>

            </div>
        </main>
    );
}
