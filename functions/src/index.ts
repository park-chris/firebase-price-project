import  { updateMarketItems } from "./modules/marketPriceTask";
import  { updatePriceNews } from "./modules/priceNewsTask";

export const scheduledUpdateTask = updateMarketItems;
export const scheduledUpdateNewsTask = updatePriceNews;
