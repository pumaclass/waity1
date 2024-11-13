const formatDate = (date, format) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    // eslint-disable-next-line default-case
    switch (format) {
        case 'yyyy-mm-dd':
            return y + "-" + m + '-' + d;
        case 'dd/mm/yyyy':
            return d + "/" + m + "/" + y;
        case 'mm-dd-yyyy':
            return m + "-" + d + "-" + y;
    }
};

export {
    formatDate
}