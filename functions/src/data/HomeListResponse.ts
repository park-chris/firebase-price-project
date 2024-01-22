
interface HomeListResponse {
    message: number;
    market: Market[];
    news: News[]; 

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
};
