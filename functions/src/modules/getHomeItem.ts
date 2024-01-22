import * as functions from "firebase-functions";
import { admin } from "../firebaseInit";

const database = admin.firestore();
const REGION = "asia-northeast3";

export const getHomeItem = functions
    .runWith({ timeoutSeconds: 540 })
    .region(REGION)
    .https
    .onRequest(async (req, res) => {
        try {

            const marketData = await getMarketData()
            const newsData = await getNewsData()

            const response: HomeListResponse = {
                message: 500,
                market: marketData,
                news: newsData,
            }

            res.json(response);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({error: "Internal Server Error"})
        }
});

/**
 * function test
 */
async function getMarketData(): Promise<Market[]>  {
    const marketSnapshot = await database.collection("markets").orderBy("id").limit(5).get();
    const marketData: Market[] = [];

    marketSnapshot.forEach(doc => {
        const data = doc.data() as Market;
        marketData.push(data);
      });
    return marketData;
};

/**
 * function test
 */
async function getNewsData(): Promise<News[]> {
    const newsSnapshot = await database.collection("news").orderBy("newsId").limit(5).get();
    const newsData: News[] = [];
  
    newsSnapshot.forEach(doc => {
      const data = doc.data() as News;
      newsData.push(data);
    });
  
    return newsData;
};
