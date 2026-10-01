export const digitWords: Record<string, string> = {
    '0': 'cero',
    '1': 'uno',
    '2': 'dos',
    '3': 'tres',
    '4': 'cuatro',
    '5': 'cinco',
    '6': 'seis',
    '7': 'siete',
    '8': 'ocho',
    '9': 'nueve'
};

const digitToWord = (num: string): string => {
    return digitWords[num] || num;
};

/**
 * Converts a number string to its Spanish word representation
 * @param numberStr - Number string to convert (e.g., "17234")
 * @returns Spanish words separated by commas (e.g., "uno, siete, dos, tres, cuatro")
 */
export const numberToWords = (numberStr: string): string => {
    if (!numberStr) return '';
    return numberStr
        .split('')
        .map(digitToWord)
        .join(', ');
};
