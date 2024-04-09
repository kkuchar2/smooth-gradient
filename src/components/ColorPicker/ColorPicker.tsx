'use client';

import React, { useEffect } from 'react';

import { Paintbrush } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type GradientPickerProps = {
    color: string;
    setColor: (background: string) => void;
    className?: string;
};

const solids = [
    '#000000',
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
        }
    }, [inputValid]);

    useEffect(() => {
        setLocalColor(inputValue);
    }, [localColor, setColor]);

    useEffect(() => {
        setLocalColor(color);
        setInputValue(color);
    }, [color]);

    useEffect(() => {
        setColor(localColor);
    }, [popoverOpen, localColor, setColor]);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'bg-white/10  border-none rounded-none w-[220px] h-[50px] justify-start text-left font-normal',
                        !color && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className={'flex w-full items-center gap-3'}>
                        {color ? (
                            <div
                                className={'size-8 rounded !bg-cover !bg-center'}
                                style={{
                                    background: localColor,
                                    border: '1px solid #ffffff66',
                                }}
                            ></div>
                        ) : (
                            <Paintbrush className={'size-5'}/>
                        )}
                        <div className={'flex-1 truncate'}>{color ? localColor : 'Pick a color'}</div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'w-64 rounded-none bg-background'}>
                <div className={'mt-0 flex flex-wrap gap-1'}>
                    {solids.map((s) => (
                        <div
                            key={s}
                            style={{ background: s }}
                            className={'size-8 cursor-pointer rounded-md active:scale-105'}
                            onClick={() => setColor(s)}
                        />
                    ))}
                </div>

                <Input
                    id={'custom'}
                    onKeyDown={onInputKeyDown}
                    defaultValue={color}
                    className={'rounded-none col-span-2 mt-4 h-8' + (inputValid ? '' : ' !border-red-500')}
                    onChange={onInputChanged}
                />
            </PopoverContent>
        </Popover>
    );
}