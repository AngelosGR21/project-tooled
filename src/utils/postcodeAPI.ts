import axios from "axios";


export const translatePostcodeToCoordinates = async (postcode: string) => {
    try {
        const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`)

        return {
            lat: response.data.result.latitude,
            long: response.data.result.longitude
        }
    } catch (err: any) {
        const error = { ...err.response.data, message: err.response.data.error };
        return Promise.reject(error);
    }

} 