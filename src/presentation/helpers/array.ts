export const groupArrayPerPage = <T>(array: T[], pageSize: number): T[][] =>{
    const pages: T[][] = [];

    for (let i = 0; i < array.length; i += pageSize) {
        pages.push(array.slice(i, i + pageSize));
    }

    return pages;
}