"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceAndSort = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${__dirname}/../../.env.api-key`, });
const getDistanceAndSort = (userStartPoint, itemsArray) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newItemsArray = [...itemsArray];
        const params = {
            start_point: userStartPoint,
            unit: "miles",
            decimal_places: "2",
        };
        const headers = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': `${process.env.APIKEY}`,
            'X-RapidAPI-Host': 'distance-calculator.p.rapidapi.com'
        };
        for (let i = 1; i < newItemsArray.length + 1; i++) {
            const lat = newItemsArray[i - 1].lat;
            const long = newItemsArray[i - 1].long;
            params[`end_point_${i}`] = `${lat}, ${long}`;
            newItemsArray[i - 1][`end_point_${i}`] = i;
        }
        const options = {
            method: "GET",
            url: 'https://distance-calculator.p.rapidapi.com/v1/one_to_many',
            params,
            headers
        };
        const { data } = yield axios_1.default.request(options);
        for (let i = 1; i < newItemsArray.length + 1; i++) {
            const key = `end_point_${i}`;
            newItemsArray[i - 1].distance = data[key].distance;
            delete newItemsArray[i - 1][key];
        }
        const compare = (a, b) => {
            if (a.distance < b.distance)
                return -1;
            if (a.distance > b.distance)
                return 1;
            return 0;
        };
        return newItemsArray === null || newItemsArray === void 0 ? void 0 : newItemsArray.sort(compare);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getDistanceAndSort = getDistanceAndSort;
