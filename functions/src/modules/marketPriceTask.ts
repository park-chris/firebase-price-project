import * as functions from "firebase-functions";
import { admin } from "../firebaseInit";
import config from "../../config.json";
import { diffStringDate, findLatestDate, formatDate, formatStringToDate } from "../util/formatDate";
  
const database = admin.firestore();
const REGION = "asia-northeast3";
let updateLastDate = "20231228";

export const updateMarketItems = functions
  .runWith({ timeoutSeconds: 540 })
  .region(REGION)
  .pubsub.schedule("0 10 * * 7")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    try {
      console.log("시장 품목 업데이트 작업이 시작되었습니다.");

      const count = await fetchDataFromOpenAPI();

      console.log(`시장 품목 업데이트 작업이 완료되었습니다. \n총 ${count}개의 아이템이 업데이트되었습니다.`);

      const configRef = database.collection("config").doc("0");
      configRef.update( "lastUpdateAt", updateLastDate);

      console.log(`시장 품목 업데이트 작업 완료일은 ${updateLastDate} 입니다.`);

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
  const today = formatDate(new Date());

  try {

    const startIndexSnapshot = await database.collection("config").doc("0").get();

    let startIndex = 1;
    const lastUpdateAt = startIndexSnapshot.data()?.lastUpdateAt || "20231210";
    let updateDate = formatDate(new Date());
    let endIndex = startIndex + 99;
    let apiUrl = `http://openAPI.seoul.go.kr:8088/${config.marketApiKey}/json/ListNecessariesPricesService/${startIndex}/${endIndex}/`;

    do {
      const fetchResponse = await fetch(apiUrl);
      if (!fetchResponse.ok) {
        throw new Error(`API request failed with status ${fetchResponse.status}`);
      }

      const data: ApiResponse = await fetchResponse.json();
      const rowList: RowData[] = data.ListNecessariesPricesService.row;

      const batch = database.batch();

      for (const rowData of rowList) {
        const nameList = rowData.A_NAME.split(" ");
        rowData.A_NAME = nameList[0];
        rowData.A_UNIT = nameList[1] || "";

        const surveyDate = formatStringToDate(rowData.P_DATE);

        if (diffStringDate(surveyDate, today)) {
          continue;
        }

        updateDate = surveyDate;

        const item: Item = {
          itemId: rowData.A_SEQ,
          itemName: rowData.A_NAME,
          itemPrice: Number(rowData.A_PRICE),
          itemUnit: rowData.A_UNIT,
          surveyDate: rowData.P_DATE,
        }

        const docRef = database.collection("markets").doc(`${rowData.M_SEQ}`).collection("items").doc(`${rowData.A_SEQ}`).collection("prices").doc(rowData.P_DATE);

        const marketRef = database.collection("markets").doc(`${rowData.M_SEQ}`).collection("items").doc(`${rowData.A_SEQ}`);

        const updateData = {
          "itemPrice": item.itemPrice,
          "itemUnit": item.itemUnit,
          "itemName": item.itemName,
        };

        updateLastDate = findLatestDate(updateLastDate, surveyDate);

        batch.update(marketRef, updateData);
        batch.set(docRef, item);
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

      apiUrl = `http://openAPI.seoul.go.kr:8088/${config.marketApiKey}/json/ListNecessariesPricesService/${startIndex}/${endIndex}/`;

    } while (diffStringDate(updateDate, lastUpdateAt));

    return count;
  } catch (error) {
    console.error("Error:", error);
    return -1;
  }
};
