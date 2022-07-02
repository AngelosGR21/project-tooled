import axios from "axios";
import { LocationSortedItem } from "./items.types";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../.env.api-key`, })

export const getDistanceAndSort = async (userStartPoint: string, itemsArray: LocationSortedItem[]) => {
  try {
    let newItemsArray: LocationSortedItem[] = [...itemsArray];
    const params: { [key: string]: any } = {
      start_point: userStartPoint,
      unit: "miles",
      decimal_places: "2",
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': `${process.env.APIKEY}`,
      'X-RapidAPI-Host': 'distance-calculator.p.rapidapi.com'
    }

    for (let i = 1; i < newItemsArray.length + 1; i++) {
      const lat = newItemsArray[i - 1].lat;
      const long = newItemsArray[i - 1].long;
      params[`end_point_${i}`] = `${lat}, ${long}`;
      newItemsArray[i - 1][`end_point_${i}`] = i
    }

    const options = {
      method: "GET",
      url: 'https://distance-calculator.p.rapidapi.com/v1/one_to_many',
      params,
      headers
    }

    const { data } = await axios.request(options);

    for (let i = 1; i < newItemsArray.length + 1; i++) {
      const key = `end_point_${i}`
      newItemsArray[i - 1].distance = data[key].distance
      delete newItemsArray[i - 1][key];
    }

    const compare = (a: LocationSortedItem, b: LocationSortedItem) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0
    }
    return newItemsArray?.sort(compare)

  } catch (e) {
    console.log(e);
  }

}