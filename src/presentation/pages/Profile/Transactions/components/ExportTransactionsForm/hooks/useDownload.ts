const useDownload = () => {

    const handleDownload = (data: string) => {
        const link = document.createElement('a')
        link.download = `history.xls`
        link.href =
            'data:application/octet-stream;charset=utf-8,' +
            encodeURIComponent(data ?? '')
        link.click();
    }

    return {
        download: handleDownload,
    }
};

export default useDownload;