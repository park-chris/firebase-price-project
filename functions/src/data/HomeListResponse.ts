
interface HomeListResponse {
    message: number;
    list: any[]; 
};

type Market = {
    id: number;
    imgUrl: string;
    latitude: number;
    longitude: number;
    name: string;
    phoneNumber: string;
    type: string;
    description: string;
    borough: string;
    address: string;
    reviewCount: number;
};

/**
 * function test
 */
type MarketData = {
    id: number;
    imgUrl: string;
    latitude: number;
    longitude: number;
    name: string;
    phoneNumber: string;
    type: string;
    description: string;
    borough: string;
    address: string;
    viewType: string; 
    reviewCount: number;
}