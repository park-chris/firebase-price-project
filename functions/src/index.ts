import  { updateMarketItems } from "./modules/marketPriceTask";
import  { updatePriceNews } from "./modules/priceNewsTask";
import  { getHomeItem } from "./modules/getHomeItem";
import  { kakaoCustomAuth } from "./modules/kakaoCustomAuth";
import  { getSearchItem } from "./modules/getSearchItem";

export const scheduledUpdateTask = updateMarketItems;
export const scheduledUpdateNewsTask = updatePriceNews;
export const getHomeList = getHomeItem;
export const getSearch = getSearchItem;
export const getKakaoCustomAuth = kakaoCustomAuth;