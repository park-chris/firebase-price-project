import  { updateMarketItems } from "./modules/marketPriceTask";
import  { updatePriceNews } from "./modules/priceNewsTask";
import  { getHomeItem } from "./modules/getHomeItem";
import  { kakaoCustomAuth } from "./modules/kakaoCustomAuth";

export const scheduledUpdateTask = updateMarketItems;
export const scheduledUpdateNewsTask = updatePriceNews;
export const getHomeList = getHomeItem;
export const getKakaoCustomAuth = kakaoCustomAuth;