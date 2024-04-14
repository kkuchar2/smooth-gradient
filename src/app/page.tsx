'use client';

import { CSSProperties, useState } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { MoveRight } from 'lucide-react';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { Slider } from '@/components/Slider/Slider';
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview';
import { Checkbox } from '@/components/ui/checkbox';
import { generateGaussGradient, generateGaussMaskGradient } from '@/lib/utils';

const noise = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAMAAAC5KTl3AAAAgVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtFS1lAAAAK3RSTlMWi3QSa1uQOKBWCTwcb6V4gWInTWYOqQSGfa6XLyszmyABlFFJXySxQ0BGn2PQBgAAC4NJREFUWMMV1kWO5UAQRdFk5kwzs/33v8Cunr7ZUehKAdaRUAse99ozDjF5BqswrPKm7btzJ2tRziN3rMYXC236humIV5Our7nHWnVdFOBojW2XVnkeu1IZHNJH5OPHj9TjgVxBGBwAAmp60WoA1gBBvg3XMFhxUQ4KuLqx0CritYZPPXinsOqB7I76+OHaZlPzLEcftrqOlOwjeXvuEuH6t6emkaofgVUDIb4fEZB6CmRAeFCTq11lxbAgUyx4rXkqlH9I4bTUDRRVD1xjbqb9HyUBn7rhtr1x+x9Y0e3BdX31/loYvZaLxqnjbRuokz+pPG7WebnSNKE3yE6Tka4aDEDMVYr6Neq126c+ZR2nzzm3yyiC7PGWG/1uueqZudrVGYNdsgOMDvt1cI8CXu63QIcPvYNY8z870WwYazTS7DqpDEknZqS0AFXObWUxTaw0q5pnHlq4oQImakpLfJkmErdvAfhsc7lod0DVT4tuob25C0tQjzdiFObCz7U7eaKGP3s6yQVgQ/y+q+nY6K5dfV75iXzcNlGIP38aj22sVwtWWKMRb7B5HoHPaBvI1Ve5TSXATi66vV6utxsV+aZNFu+93VvlrG/oj8Wp67YT8l+Oq6PjwdGatFm7SEAP13kE0y9CEcf9qhtEWCMIq5AGq71moEAI9vrmFcmO8+7ZyDnmRN/VUaFkM2ce8KuBGFzDMmY6myLfQGra2ofgHhbJRXuRDZ4H+HmliWBHXQ0ysLGfv6FetbxtxzRgIZWjIsGVFl5imPXeyvVyayNek+dSWzjXd4t310YBdaF8sXeKs481PjsXbAtIru2+wHbv3GVh3sQY6Dnu6pF3pZ714VYdDi9A5GkXR/6xgaZN/tpQ8wVV3zeBuB+njoBNE4wjc+uA523ysXGd/P2sntmOb3OdHNWP5OVrxD3eJHdtH8QVkEIAqCor3hReR96yqt6PkTQfenllooQ447h6tOrnnuzwA8fMpq+jqg1oW8fTYYIncAYpVeTvkEFr/khQSbjoE8ykx9049OkE5MQEO9lC24tT7DwThQgf4Fhf8nGgAo3GYaON3crODpOr2pu5dBABz69t7F5yJBBo+r6QJdeLDWEoO7r1tceR3haA7gc7eZrCvpxSXXeKpo4P+hRixo9DeOFbqQVjKyWfBg9pnrEZKzK7R437YTTwhfoySG/YOCt3fs4aXlU3FjKortqQ6XyXaD0+Y/8VoqpyU9TRW45eN4oBxAH8Y/jLnNXfELJW+/p/MgO9Z+mBli2qqAP7dV/Arc2+YZRZwtBW8/p32y5ZsEuCS4O5AAgfR7Dde7zhiGfgvurQkfAXIrUG61rmxc2EZo18ph4vaWZI+QM0JdsbNlBJlPlwf9uguujQJy0j7TgTHdtRnjybTg55Hkk9S6l2rpYahumSewKHVosa1bh2Y6r9JGkdKvIDN/eeAwScrfjoLkCxWJuFZQ53FNP5w9XbQd1HhgHcVB/0fATG3sUUid1RTfc2+7pZVKldFSsaEK0v4k90tapQOk2HIbMhaJQtrUEL5+3sDanh8sOpbYRoQoqXWu6SQcUTQL9jzOrXNPWCJwXge4U7tlU1hkF012cAmvp8llQxf1IEMcw14pURxVOWATz4ITnYQjuF+vDXg5hgoiqXzO6mS91FQUBheURHIJxUeU1i3P0WOMpsm7vFYk0JJi/Ev+X3FwYD69cARPuP5GIc0PxoAFjcLRbNur0iMTrQmBBNYJ2ngU4x7SWfdTRl52Bqv7LmYW3C1CyTCPTHeWWIAM/Whm32COHsaj+2UQ739XB9t6NV0o9E9b7CW3XNiXzi9e0KiE+3rntukdIDBWrU2jsfQWuyFJRANxq8StHVv1JPy2C3Byco7qdNbASrnNXZ8G0L/Wp/pif4Ai9aEZ9Bb+TRx+REBdGlkF/s0dUdMSMr+6YCbuGxqPWdzcdqutvqkBzCksFcwAtjf55TeuH79M6AQa7r5PLeXxMFIlQKrXP9VJ275WGX+ptpf+tvTDBsecPnYQAlAWrVbRVJ7K2pRHwIjtSpbX96Y/lbKk6ZWXlBmh15r8yAWQsYxXgBOXYMAfHnUXF+rDqnB8bXDRtAn7bCziIqetSboK3NexMePvsCRLvmsoREA+kH8j4HWFpnNEaWgOmR7xyXHfTaz3slHc/YA6H6tl/L8d5tPcIwwD0tjvRaq3Y5BmYBSDClpv0VIX4s8D0XK3sPdpAb94HjPLkgboEz9EdZATW6ZdcmQvtKUwoWw+nAVKA7IcdY1UHnvNnIBplKci+knzewLz5/GGnzkGuuGky+0LTjtGBGR85EQICDqKChnm5pH3Z44nnWAk1YRdyu3g7QoFZ0h8jkr2ffjKmi+Qvsp+9GvNGZHmgW+YQAGUw7PPt8IPKbdy432vhKtRJjKWcSqq7helj81o3nfmaxVZ7Sqie8OOBk9WsyTD/ab7fQ5aWwQeJvnH6+ayo4IdIkOSBJjzXkgr+1TPhAx1AXDsxtCCj3TzQTLA1p782f7a8vdgPfwwrXmZxxbqo2h+6Zlo6mcMY4V7cFBOLm17VCvx9Qa2tAnkxEB+KYyQgbgAAnmNDOdOO6y2Cb+lke1MWQc9o+EMdQf7ubIG3Ek8GZ4k1PtGjbhwgOMPp5Em59JMVk/jU8/aF73Xcrd3UBNZyueQu0/xz2aGtZT8CRziOax2BWFXaeDzgZNV7oRtUzFoijoETf3xkAFFk3OMb7SgPh5wxU1+MygDIp9gZChH2qEcpgLh8pBIK90PXT1ZSU+ZExFK4Vm4GL/J7+K13lS5dQkW4HQwl6GX4yLqu8GhGWS2k75yel5IZIfFNdAL0NpKr2N5dQesBnxa42DLgJd6agS1jJsp1mO1dip7PU4P6diLLoTsZ4m3Q0QweiqeFfIGPLgF6v6mSVv6xe85VBD/1Mpe3AurRbcJ9SEo8NszNVy8rOCEexyIFcJRvYAlI/wk2I7r3p60FFLQXoH2q9xri/m41svRPbW0/EnPn2DWsmk0IiPpB60aa3+hiFfWuC8ZvWKEd9LxAk3HcOof6d77RewPaPsGw5lQAHcZN2vx1448u9pLfMLGQ3BSRRjBzRhKt7HcCw/7aqjtCDs5q76b4ZGphxN2th1WeXYlfnozX3ebKtX4Te11hf1tZP1diiGjIDAB1cR4Sb9rcFPC/nBARjlgDxd+tCBb1t91j71xJcgGjT3g/dUFnXXNiDrxkyoHANPk58ACPUa42hj8tgGrhiXOCmygxFZBiT2wyAJTDJ4wJEPmp6JIrDaSWYNqv4xH2wwdSTGYb3E0pXnS39nmLUsqoVZxzSoegqzd0o06wdbTXsaHGL+IF4JtIcXddTcD/dCd8hVf+fWPSV553kjMmMEULLS8HcgmptDO955dLGX78PjiDA6IsTHPm5IA6bc5ha0gaGkoEttXuxU11B2dOJ65/Q08tEF1+Y9cr2Nh/VECfQ33GyvR/gsdN1LuIeLpKMCAF2yRr769g9/4aJLZNRI71m2S91+Kp+Q0zubTcxoG2/6gm1Q79wkMj2XNO2ui7nWw8ULtu27CCvqTGX2PffD+xcwgh/TrOKvGZMM5jRFGDTn4NO/lwnDR/GY/waDZtkWDUPI0O8ztcFVqp6r2ZW+2bvkJ3raptYagFqu95VdIaml2CIp6CKets34x+fH2C+zH4cVFO7vj+6k2FU39PtRhWluYeZ3gDz1TLB9K2v7SD9gJU1qDxoRDrAWcrFGLyndhdtd0505+gEP79adK8fmFCWNYC+ahzVNcRH79E8dA1iqX/N0qq22xcOc20ALxLDspEj4QCFBQMgaIwoKbxr0Bd7Sbws6GiRK6tqoPfpiCle23axejRLyO1I+ahsEpWrzT5ZsCyS5RcY9jMfENFxSnhKsrfW8JHH6/rdQUMfmQPT3Uz9gY0C/pu1yuCnrPUvio0a1qMEosA/EwIzzid7cqsAAAAASUVORK5CYII=';

export default function Home() {

    const [startColor, setStartColor] = useState('#ffffff');
    const [stopColor, setStopColor] = useState('#1a1a1a');

    const [stdDev, setStdDev] = useState(0.2);
    const [mean, setMean] = useState(0);
    const [stops, setStops] = useState(35);
    const [direction, setDirection] = useState('right');
    const [opacity, setOpacity] = useState(0.6);
    const [enableMask, setEnableMask] = useState(true);
    const [maskMean, setMaskMean] = useState(0);
    const [maskStdDev, setMaskStdDev] = useState(0.2);
    const [maskStops, setMaskStops] = useState(20);

    const [gradient] = generateGaussGradient(startColor, stopColor, stops, mean, stdDev);
    const [maskGradient] = generateGaussMaskGradient(maskStops, maskMean, maskStdDev);

    const onEnableMaskChange = (checked: CheckedState) => {
        setEnableMask(typeof checked === 'boolean' ? checked : false);
    };

    const onDirectionClick = () => {
        const currentStartColor = startColor;
        setStartColor(stopColor);
        setStopColor(currentStartColor);
        setDirection(direction === 'right' ? 'left' : 'right');
    };

    const gradientStyle = {
        backgroundImage: gradient,
        mask: enableMask ? `url(${noise}), ${maskGradient}` : 'none',
        width: '100%',
        height: '100%',
        opacity: opacity
    } as CSSProperties;

    const gradientParentStyle = {
        flexGrow: 1,
        background: stopColor
    };

    const gradientStyleAsString = JSON.stringify(gradientStyle, null, 2);
    const gradientParentStyleAsString = JSON.stringify(gradientParentStyle, null, 2);
    const htmlAsString = `<div style="${gradientParentStyleAsString}">
    <div style="${gradientStyleAsString}" />
</div>`;

    return (
        <main className={'flex min-h-screen flex-col items-center justify-between p-24'}>
            <div className={'w-[1200px]'}>
                <div className={'m-3 text-center font-mono text-2xl tracking-tight'}>
                    {'Gaussian gradient generator'}
                </div>
                <div className={'flex flex-col p-8'}>
                    <div className={'flex gap-6'}>
                        <div className={'flex w-[320px] flex-col'}>
                            <div className={'flex flex-col gap-3'}>
                                <div className={'flex flex-col gap-3 rounded-xl bg-white/5 p-5'}>
                                    <div className={'text-sm font-bold'}>
                                        {'Base gradient'}
                                    </div>
                                    <div className={'flex items-center gap-3'}>
                                        <ColorPicker color={startColor} setColor={setStartColor}/>
                                        <MoveRight className={'size-3 cursor-pointer text-white'}
                                            onClick={onDirectionClick}/>
                                        <ColorPicker color={stopColor} setColor={setStopColor}/>
                                    </div>

                                    <Slider
                                        title={`Std dev: ${stdDev}`}
                                        min={0.001}
                                        max={3}
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
                                        title={`Opacity: ${opacity}`}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        defaultValue={0.6}
                                        onValueChange={setOpacity}
                                        onReset={() => setOpacity(1)}/>
                                </div>
                                <div className={'flex flex-col gap-3 rounded-xl bg-white/5 p-5'}>
                                    <div className={'flex items-center justify-start space-x-2'}>
                                        <Checkbox className={'size-5'} checked={enableMask}
                                            onCheckedChange={onEnableMaskChange}/>
                                        <div className={'grid gap-1.5 leading-none'}>
                                            <div className={'text-sm font-bold'}>
                                                {'Noise mask'}
                                            </div>
                                        </div>
                                    </div>
                                    <Slider
                                        title={`Mean: ${maskMean}`}
                                        min={-3}
                                        max={3}
                                        step={0.01}
                                        defaultValue={0}
                                        onValueChange={setMaskMean}
                                        onReset={() => setMaskMean(0)}/>
                                    <Slider
                                        title={`Std dev: ${maskStdDev}`}
                                        min={0.001}
                                        max={3}
                                        step={0.01}
                                        defaultValue={0.5}
                                        onValueChange={setMaskStdDev}
                                        onReset={() => setMaskStdDev(0.5)}/>
                                    <Slider
                                        title={`Stops: ${maskStops}`}
                                        min={1}
                                        max={200}
                                        step={1}
                                        defaultValue={20}
                                        onValueChange={setMaskStops}
                                        onReset={() => setMaskStops(20)}/>
                                </div>
                            </div>
                        </div>
                        {/* GENERATED GRADIENT */}
                        <div style={gradientParentStyle}>
                            <div style={gradientStyle}/>
                        </div>
                    </div>
                </div>
                <div
                    className={'w-full max-w-full overflow-y-auto border-none bg-none p-8 pt-0 text-sm tracking-tighter text-white shadow-none'}>
                    <SourceCodePreview sourceCode={htmlAsString}/>
                </div>
            </div>
        </main>
    );
}
