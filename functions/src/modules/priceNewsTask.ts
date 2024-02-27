import * as functions from "firebase-functions";
import { admin } from "../firebaseInit";
import config from "../../config.json";

const database = admin.firestore();
const REGION = "asia-northeast3";

export const updatePriceNews = functions
  .runWith({ timeoutSeconds: 540 })
  .region(REGION)
  .pubsub.schedule("0 14 * * 7")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    try {
      console.log("물가 소식 업데이트 작업이 시작되었습니다.");

      const count = await fetchDataFromOpenAPI();

      console.log(`물가 소식 업데이트 작업이 완료되었습니다. \n총 ${count}개의 아이템이 업데이트되었습니다.`);

      return null;
    } catch (error) {
      console.error("에러 발생:", error);
      return null;
    }
  });

/**
 * function test
 */
async function fetchDataFromOpenAPI(): Promise<number> {

  let count = 0;
  let taskUpdateLastId = 0;
  
  try {

    const startIndexSnapshot = await database.collection("config").doc("0").get();

    let startIndex = 1;
    const lastUpdateId = startIndexSnapshot.data()?.newsLastUpdateId || 0;
    let responseCount = 1;
    let endIndex = startIndex + 99;
    let apiUrl = `http://openapi.seoul.go.kr:8088/${config.newsApiKey}/json/VwNotice/${startIndex}/${endIndex}/`;

    do {
      const fetchResponse = await fetch(apiUrl);
      if (!fetchResponse.ok) {
        throw new Error(`API request failed with status ${fetchResponse.status}`);
      }

      const data: NewsApiResponse = await fetchResponse.json();
      const rowList: NewsRowData[] = data.VwNotice.row;

      const batch = database.batch();

      for (const rowData of rowList) {

        if (rowData.N_SEQ < lastUpdateId) {
          continue;
        } else {
          if (taskUpdateLastId < rowData.N_SEQ) {
            taskUpdateLastId = rowData.N_SEQ
          }
        }

        const news: News = {
          newsId: Number(rowData.N_SEQ),
          newsTitle: rowData.N_TITLE,
          newsContent: rowData.N_CONTENTS,
          newsDate: rowData.REG_DATE,
          newsFilePath: rowData.FILE_PATH,
        }

        const docRef = database.collection("news").doc(`${rowData.N_SEQ}`);

        batch.set(docRef, news);
        count += 1;
      }

      try {
        await batch.commit();
        console.log(`${startIndex} ~ ${endIndex} items are successfully!`)
      } catch (error) {
        console.error(`${startIndex} ~ ${endIndex} items are failed!`)
      }

      startIndex += rowList.length;
      endIndex += rowList.length;
      responseCount = rowList.length;

      apiUrl = `http://openapi.seoul.go.kr:8088/${config.newsApiKey}/json/VwNotice/${startIndex}/${endIndex}/`;

    } while (responseCount >= 100);

    
    const configRef = database.collection("config").doc("0");
    configRef.update( "newsLastUpdateId", taskUpdateLastId);

    return count;
  } catch (error) {
    console.error("Error:", error);
    return -1;
  }
};
