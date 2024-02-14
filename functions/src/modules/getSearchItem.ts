import * as functions from "firebase-functions";
import { admin } from "../firebaseInit";

const database = admin.firestore();
const REGION = "asia-northeast3";

export const getSearchItem = functions
    .runWith({ timeoutSeconds: 540 })
    .region(REGION)
    .https
    .onRequest(async (req, res) => {
        try {

            const query: string | any =  req.query["keyword"] !== undefined ? req.query["keyword"].toString() : undefined;

            const markets = await getMarketData();

            const resultMarket: Market[] = [];

            if (typeof query === "string") {
                markets.forEach(market => {
                    if (market.name.includes(query)) {
                        resultMarket.push(market)
                    }
                })
            }

            const arrayLength = markets.length;
            const randomIndexes: number[] = [];
            let combinedData

            while (randomIndexes.length < 10) {
                const randomIndex = Math.floor(Math.random() * arrayLength);
                if (!randomIndexes.includes(randomIndex)) {
                    randomIndexes.push(randomIndex);
                }
            }

            const recommandedMarket: Market[] = randomIndexes.map(index => markets[index]);
            
            if (typeof query === "string") {
                const result1 = {
                    title: "검색 결과",
                    items: resultMarket,
                    titleVisible: false,
                    viewType: "HORIZONTAL",
                };
                const result2 = {
                    title: "추천 시장",
                    items: recommandedMarket,
                    titleVisible: false,
                    viewType: "HORIZONTAL",
                }
                combinedData = [result1, result2];
            } else {
                const result1 = {
                    title: "추천 시장",
                    items: recommandedMarket,
                    titleVisible: false,
                    viewType: "HORIZONTAL",
                }
                combinedData = [result1];
            }

            const response: HomeListResponse = {
                message: 500,
                list: combinedData,
            }

            res.json(response);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: "Internal Server Error" })
        }
    });

/**
 * 서버에서 검색을 수행하는 함수
 * @return {Promise<MarketData>} - Firebase 응답을 포함하는 프로미스 객체
 */
async function getMarketData(): Promise<MarketData[]> {

    const marketSnapshot = await database.collection("markets").get();
    const marketDataList: MarketData[] = [];

    marketSnapshot.forEach(doc => {
        const data = doc.data() as Market;
            const marketData: MarketData = {
                id: data.id,
                imgUrl: data.imgUrl,
                latitude: data.latitude,
                longitude: data.longitude,
                name: data.name,
                phoneNumber: data.phoneNumber,
                type: data.type,
                description: data.description,
                borough: data.borough,
                address: data.address,
                viewType: "MARKET",
                reviewCount: data.reviewCount,
            }
        
            marketDataList.push(marketData);
        
    });
    return marketDataList;
};
