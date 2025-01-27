import { exchangeDataType, serviceReturnType } from "@/types/types";
import axios, { AxiosResponse } from "axios";
export const getCurrentExchangeRates = async (): Promise<serviceReturnType> => {
  try {
    const res: AxiosResponse = await axios.get(
      "https://finans.truncgil.com/today.json"
    );
    return {
      statusCode: 200,
      message: "success",
      data: res.data as exchangeDataType,
    };
  } catch (error) {
    console.error("error", error);
    return { statusCode: 500, message: "Error" };
  }
};
