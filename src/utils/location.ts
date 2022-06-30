import axios from "axios";
import { Item } from "./items.types";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../.env.api-key`, })

export const getDistance = async (userStartPoint: string, itemsArray: Item[]) => {
  try {
    let newItemsArray: Item[] = [...itemsArray];
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
      newItemsArray
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

    return newItemsArray;

  } catch (e) {
    console.log(e);
  }

}