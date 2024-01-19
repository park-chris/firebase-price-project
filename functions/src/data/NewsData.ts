
type News = {
    newsId: number;
    newsTitle: string;
    newsContent: string;
    newsDate: string;
    newsFilePath: string;
};

// 주어진 JSON 데이터의 타입 정의
interface NewsRowData {
    N_SEQ: number;
    N_TITLE: string;
    N_CONTENTS: string;
    N_VIEW_COUNT: number;
    REG_DATE: string;
    FILE_PATH: string;
}

// 주어진 JSON 데이터의 전체 타입 정의
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

