
type News = {
    newsId: number;
    newsTitle: string;
    newsContent: string;
    newsDate: string;
    newsFilePath: string;
};

interface NewsRowData {
    N_SEQ: number;
    N_TITLE: string;
    N_CONTENTS: string;
    N_VIEW_COUNT: number;
    REG_DATE: string;
    FILE_PATH: string;
}

interface NewsApiResponse {
    VwNotice: {
        list_total_count: number;
        RESULT: {
            CODE: string;
            MESSAGE: string;
        };
        row: NewsRowData[];
    };
}

