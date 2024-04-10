'use client';

import React, { useCallback, useEffect } from 'react';

import { Paintbrush } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import styles from './ColorPicker.module.scss';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';

type GradientPickerProps = {
    color: string;
    setColor: (background: string) => void;
    className?: string;
};

const solids = [
    '#000000',
    '#14151A',
    '#0e1111',
    '#a05151',
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
];

function hex2rgba(color1: string) {
    const v = color1.match(/\w\w/g);

    if (!v) {
        throw new Error('Invalid color');
    }

    return v.map(hex => parseInt(hex, 16));
}

export function ColorPicker(props: GradientPickerProps) {

    const { color, setColor, className } = props;

    const [inputValue, setInputValue] = React.useState(color);
    const [inputValid, setInputValid] = React.useState(true);
    const [localColor, setLocalColor] = React.useState(color);
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const validateInput = (value: string) => {
        const valid = (/^#[0-9A-F]{6}$/i).test(value);
        setInputValid(valid);
        return valid;
    };

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        setInputValid(validateInput(value));
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && validateInput(inputValue)) {
            setPopoverOpen(false);
            setColor(inputValue);
        }
    };

    useEffect(() => {
        if (inputValid) {
            setLocalColor(inputValue);
            setColor(inputValue);
        }
    }, [inputValid]);

    useEffect(() => {
        setLocalColor(color);
        setInputValue(color);
    }, [color]);

    const onColorChange = useCallback((color: string) => {
        setLocalColor(color);
        setColor(color);
    }, [setLocalColor]);

    const isColorDark = (color: string) => {
        // extract rgb values from hex color
        const rgba = hex2rgba(color);
        const luma = 0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2];
        return luma < 40;
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={'h-[55px] bg-white/5 w-[140px] p-3 text-white hover:bg-white/10 border border-white/10 rounded-md ' + className}>
                    <div className={'flex w-full items-center gap-3'}>
                        {color ? (
                            <div
                                className={'size-10 rounded-full !bg-cover !bg-center'}
                                style={{
                                    background: localColor,
                                    transition: 'border-color 0.2s',
                                    border: '2px solid ' + (isColorDark(localColor) ? '#ffffff88' : 'transparent'),
                                }}
                            ></div>
                        ) : (
                            <Paintbrush className={'size-5'}/>
                        )}
                        <div className={'flex-1 truncate'}>{color ? localColor : 'Pick a color'}</div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'overflow-hidden rounded-xl border-none bg-[#323232] p-0 '}>
                <div className={styles.small}>
                    <HexColorPicker color={localColor} onChange={onColorChange}/>
                </div>

                <div className={'p-[10px]'}>
                    <Input
                        id={'custom'}
                        onKeyDown={onInputKeyDown}
                        defaultValue={color}
                        value={inputValue}
                        className={'bg-white/5 focus:bg-white/15 focus:outline-none rounded-none col-span-2 my-4 h-8 text-md font-semibold' + (inputValid ? 'border-none' : ' !border-red-500')}
                        onChange={onInputChanged}
                    />
                    <div className={'mt-0 flex flex-wrap gap-3'}>
                        {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className={'size-9 cursor-pointer rounded-md active:scale-105'}
                                onClick={() => setColor(s)}
                            />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}