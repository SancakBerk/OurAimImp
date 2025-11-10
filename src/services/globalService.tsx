import { exchangeDataType, serviceReturnType } from "@/types/types";
import axios, { AxiosResponse } from "axios";
export const getCurrentExchangeRates = async (): Promise<serviceReturnType> => {
  try {
    const res: AxiosResponse = await axios.get(
      "/api/exchange-rates"
    );
    return {
      statusCode: res.data.statusCode,
      message: res.data.message,
      data: res.data.data as exchangeDataType,
    };
  } catch (error) {
    console.error("error", error);
    return { statusCode: 500, message: "Error" };
  }
};
