export function parseDate(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return '' + y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

export const parseTime = (date: Date): string => {
    const h = date.getHours();
    const min = date.getMinutes();
    return '' + (h < 10 ? '0' : '') + h + (min < 10 ? '0' : '') + min;
};
