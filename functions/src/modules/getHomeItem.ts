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
            const noticeData = await getNoticeData()

            const notice = {
                items: noticeData,
                viewType: "VIEW_PAGER",
            };

            const market = {
                title: "서울 전통시장",
                items: marketData,
                titleVisible: true,
                viewType: "HORIZONTAL",
            };

            const news = {
                title: "물가 소식",
                items: newsData,
                titleVisible: true,
                viewType: "HORIZONTAL",
            };

            const combinedData = [notice, market, news];

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
 * function test
 */
async function getMarketData(): Promise<MarketData[]> {
    const marketSnapshot = await database.collection("markets").orderBy("id", "desc").limit(5).get();
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

/**
 * function test
 */
async function getNewsData(): Promise<NewsData[]> {
    const newsSnapshot = await database.collection("news").orderBy("newsId", "desc").limit(5).get();
    const newsDataList: NewsData[] = [];

    newsSnapshot.forEach(doc => {
        const data = doc.data() as News;
        const newsData: NewsData = {
            newsId: data.newsId,
            newsTitle: data.newsTitle,
            newsContent: data.newsContent,
            newsDate: data.newsDate,
            newsFilePath: data.newsFilePath,
            viewType: "NEWS",
        };
        newsDataList.push(newsData);
    });

    return newsDataList;
};

/**
 * function test
 */
async function getNoticeData(): Promise<NoticeData[]> {
    const noticeSnapshot = await database.collection("notices").orderBy("id", "desc").get();
    const noticeDataList: NoticeData[] = [];

    noticeSnapshot.forEach(doc => {
        const data = doc.data() as Notice;

        if (data.enabled) {
            const noticeData: NoticeData = {
                id: data.id,
                title: data.title,
                subtitle: data.subtitle,
                imageUrl: data.imageUrl,
                content: data.content,
                viewType: "NOTICE",
            };
            noticeDataList.push(noticeData);
        }
    });

    return noticeDataList;
};

