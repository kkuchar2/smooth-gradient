import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine clsx and tailwind-merge
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

// Convert hex color to rgba
export const hex2rgba = (color: string) => {

    // Split HEX color into 3 parts (R, G, B)
    const split = color.match(/\w\w/g);

    if (!split) {
        throw new Error(`Invalid color ${color}`);
    }

    return split.map(hex => parseInt(hex, 16));
};

// Convert decimal value to hex
export const decimalToHex = (d: number) => d.toString(16);

/**
 * Mix two colors like SCSS mix() function - based on https://gist.github.com/jedfoster/7939513
 * @param color1 - hex color 1
 * @param color2 - hex color 2
 * @param weight - weight of the mix
 * @returns mixed color as hex
 */
export const mixHexColors = (color1: string, color2: string, weight: number): string => {

    // Convert hex to RGB for both colors
    const rgba1 = hex2rgba(color1);
    const rgba2 = hex2rgba(color2);

    // Start the result color with a hash since this will be a hex value
    let result = '#';

    // Loop over RGB
    for (let i = 0; i < 3; i++) {

        // Get current color component (R, G, or B)
        const v1 = rgba1[i];
        const v2 = rgba2[i];

        // Calculate the component color based on the weight and color1 and color2
        let val = decimalToHex(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        // Prepend a '0' if val results in a single digit
        while (val.length < 2) {
            val = '0' + val;
        }

        // Append the value to the result
        result += val;
    }
    return result;
};

const pi = 3.14159;
const e = 2.71828;

export const gaussianCurve = (x: number, mean: number, stdDev: number) => {
    // Calculate the factor
    const factor = 1 / (stdDev * Math.sqrt(2 * pi));

    // Calculate the exponent
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);

    // Return the Gaussian value
    return factor * Math.pow(e, exponent);
};

export const calculateGaussianWeights = (steps: number, mean: number, stdDev: number): number[] => {
    let weights = [] as number[];
    for (let i = 0; i < steps; i++) {
        weights.push(gaussianCurve(i / steps, mean, stdDev));
    }
    return weights;
};

export const generateGaussGradient = (startColor: string,
    endColor: string,
    stops: number,
    mean: number,
    stddev: number,
    gradientType = 'radial-gradient'
): [string, number[]] => {

    // Calculate weights based on Gaussian curve
    let weights = calculateGaussianWeights(stops, mean, stddev);

    // Calculate normalization factor to fit weights within 0 to 100 (range required by mix)
    const maxWeight = Math.max(...weights);
    const scaleFactor = 100 / maxWeight;

    // Calculate next color based on weights
    let gradient = '';
    let i = 0;

    weights.forEach(weight => {
        // Scale the weight to fit within 0 to 100
        const scaledWeight = weight * scaleFactor;

        // Calculate the current color by mixing start and end colors based on the weight
        const currentColor = mixHexColors(startColor, endColor, scaledWeight);

        // Add the stop percentage point to the gradient
        if (i === 0) {
            // First stop will be 0%
            gradient += currentColor + ' 0%';
        }
        else {
            // Other stops will be calculated based on the stop percentage
            const percent = (i / stops) * 100;
            const percentRounded = Math.round(percent * 100) / 100;
            gradient += `, ${currentColor} ${percentRounded}%`;
        }
        i++;
    });

    return [`${gradientType}(${gradient})`, weights];
};

export const generateGaussMaskGradient = (stops: number, mean: number, stddev: number, gradientType = 'radial-gradient')
: [string, number[]] => {

    // Calculate weights based on Gaussian curve
    let weights = calculateGaussianWeights(stops, mean, stddev);

    // Calculate normalization factor to fit weights within 0 to 100 (range required by mix)
    const maxWeight = Math.max(...weights);
    const scaleFactor = 100 / maxWeight;

    // Calculate next color based on weights
    let gradient = '';
    let i = 0;

    weights.forEach(weight => {
        // Scale the weight to fit within 0 to 100
        const scaledWeight = weight * scaleFactor;

        // Calculate the current color by mixing start and end colors based on the weight
        const currentOpacity = scaledWeight / 100;
        const currentOpacityHex = Math.floor(currentOpacity * 255).toString(16).padStart(2, '0');

        // Add the stop percentage point to the gradient
        if (i === 0) {
            gradient += `#ffffff${currentOpacityHex} 0%`;
        }
        else {
            const percent = (i / stops) * 100;
            const percentRounded = Math.round(percent * 100) / 100;
            gradient += `, #ffffff${currentOpacityHex} ${percentRounded}%`;
        }
        i++;
    });

    // 4. Output the gradient
    return [`${gradientType}(${gradient})`, weights];
};