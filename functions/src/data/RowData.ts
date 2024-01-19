
type Item = {
    itemId: number;
    itemName: string;
    itemPrice: number;
    itemUnit: string;
    surveyDate: string;
};

// 주어진 JSON 데이터의 타입 정의
interface RowData {
    P_SEQ: number;
    M_SEQ: number;
    M_NAME: string;
    A_SEQ: number;
    A_NAME: string;
    A_UNIT: string;
    A_PRICE: number;
    P_YEAR_MONTH: string;
    ADD_COL: string;
    P_DATE: string;
    M_TYPE_CODE: string;
    M_TYPE_NAME: string;
    M_GU_CODE: string;
    M_GU_NAME: string;
}

// 주어진 JSON 데이터의 전체 타입 정의
interface ApiResponse {
    ListNecessariesPricesService: {
        list_total_count: number;
        RESULT: {
            CODE: string;
            MESSAGE: string;
        };
        row: RowData[];
    };
}

