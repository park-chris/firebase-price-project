
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
};

export const formatStringToDate = (stringDate: string): string => {
    const formattedDate = stringDate.replace(/-/g, "");
    return formattedDate;
};

export const diffStringDate = (date1: string, date2: string): boolean => {
    const formatDate = (date: string): Date => {
        if (date.length === 8) {
            return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`);
        }
        else if (date.length === 10) {
            return new Date(date);
        }
        throw new Error("지원하지 않는 날짜 형식입니다.");
    };

    const date1Object = formatDate(date1);
    const date2Object = formatDate(date2);

    return date1Object > date2Object;
};

export const parseDateString = (dateString: string): Date | null => {
    const dateRegex = /^(\d{4})(\d{2})(\d{2})$/;
    const match = dateString.match(dateRegex);

    if (!match) {
        console.error("Invalid date string format");
        return null;
    }

    const [, year, month, day] = match.map(Number);
    const parsedDate = new Date(year, month - 1, day); 

    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date");
        return null; 
    }

    return parsedDate;
};
  
export const findLatestDate = (date1: string, date2: string): string => {
const parsedDate1 = parseDateString(date1);
const parsedDate2 = parseDateString(date2);

if (parsedDate1 == null || parsedDate2 == null) {
    throw new Error("Invalid date format");
}

return parsedDate1 > parsedDate2 ? date1 : date2;
};


export const parseDateToYearMonth = (dateString: string):string | null => {
    const dateRegex = /^(\d{4})(\d{2})(\d{2})$/;
    const match = dateString.match(dateRegex);

    if (!match) {
        console.error("Invalid date string format");
        return null;
    }

    const [, year, month, day] = match.map(Number);
    const parsedDate = new Date(year, month - 1, day); 

    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date");
        return null; 
    }

    return `${parsedDate.getFullYear}-${parsedDate.getMonth}`;
};