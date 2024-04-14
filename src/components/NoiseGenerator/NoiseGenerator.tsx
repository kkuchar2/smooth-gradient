import React, { useEffect, useRef, useState } from 'react';

import { Slider } from '@/components/Slider/Slider';

type NoiseGeneratorProps = {
    onNoiseGenerated: (noiseDataUrl: string) => void;
    backgroundColor?: string;
};

function hex2rgba(color: string) {
    const v = color.match(/\w\w/g);

    if (!v) {
        throw new Error('Invalid color');
    }

    return v.map(hex => parseInt(hex, 16));
}

const NoiseGenerator = (props: NoiseGeneratorProps) => {
    const { onNoiseGenerated, backgroundColor } = props;

    const [noiseSize, setNoiseSize] = useState(128);
    const [rotate, setRotate] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateBase128Noise = () => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return '';
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return '';
        }

        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < noiseSize; i++) {
            for (let j = 0; j < noiseSize; j++) {
                const alpha = Math.floor(Math.random() * 255);
                ctx.fillStyle = `rgba(${255}, ${0}, ${0}, ${alpha / 255})`;
                ctx.fillRect(i, j, 1, 1);
            }
        }
        ctx.translate(noiseSize / 2, noiseSize / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.translate(-noiseSize / 2, -noiseSize / 2);
        return canvas.toDataURL();
    };

    useEffect(() => {
        const noise = generateBase128Noise();
        onNoiseGenerated(noise);
    }, [noiseSize, rotate, backgroundColor]);

    return (
        <div className={'size-[512px]'}>
            <Slider
                title={'Noise Size'}
                min={2}
                max={128}
                step={1}
                defaultValue={128}
                onValueChange={setNoiseSize}
                onReset={() => setNoiseSize(128)}
            />
            <Slider
                title={'Rotate'}
                min={0}
                max={360}
                step={1}
                defaultValue={0}
                onValueChange={setRotate}
                onReset={() => setRotate(0)}/>
            <div className={'flex items-start'}>
                <div className={'bg-white'}>
                    <canvas width={noiseSize} height={noiseSize} ref={canvasRef}/>
                </div>
            </div>
        </div>
    );
};

export default NoiseGenerator;
