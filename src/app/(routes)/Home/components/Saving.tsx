import { RootState } from "@/redux/store";
import {
  barChartDataType,
  exchangeDataType,
  perSavingsType,
  pieCharDataType,
  serviceReturnType,
  totalSavingsObjectType,
  totalSavingsType,
  totalSavingTypeWithDocumentId,
} from "@/types/types";
import React, { JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPerSavingsByUserId,
  UpdateTotalSavingsData,
} from "@/services/savingService";
import { InputComponent } from "@/components/InputComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useFormik } from "formik";
import { addSavingsSchema } from "@/utils/loginInformationSchemas";
import { monthNames, savingRowInformations, theme } from "@/utils/constants";
import { Timestamp } from "firebase/firestore";
import { PieChart } from "@mui/x-charts/PieChart";
import { setTotalSavingData } from "@/redux/slices/homePageSlice";
import {
  calculateSavingDataToTl,
  calculateTotalSavingsAsTlRateAndReturnNumber,
  changeNumberToThreeDigitsAndReturn,
  getFloatValueAsFixed2,
  returnDescriotionFromKey,
} from "@/utils/helperFunctions";
import { BarChart } from "@mui/x-charts/BarChart";
import { createTheme, ThemeProvider } from "@mui/material";

export const SavingComponent = (): JSX.Element => {
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const [pieChartData, setPieChartData] = useState<pieCharDataType[]>([]);

  const [barChartData, setBarChartData] = useState<barChartDataType[]>([]);
  const [, settotalSavingDataAsTl] = useState<pieCharDataType[]>([]);
  const [savingsData, setSavingsData] =
    useState<totalSavingTypeWithDocumentId | null>(null);
  const [themeState, setThemeState] = useState(theme);
  const [isTotalSavingProcessAdding, setIsTotalSavingProcessAdding] =
    useState(true);
  const dispatch = useDispatch();
  const valueFormatter = (item: { value: number }) => ` ${item.value}% `;
  useEffect(() => {
    setSavingsData(homePageSlice.totalSavingData);
    calculateBarChartData();
  }, [globalSlice.userId]);
  useEffect(() => {
    console.log("is dark mode handled", globalSlice.isDarkMode);

    theme.palette.mode = globalSlice.isDarkMode ? "dark" : "light";
    setThemeState(
      createTheme({
        palette: {
          mode: globalSlice.isDarkMode ? "dark" : "light",
          text: { primary: globalSlice.isDarkMode ? "#ffffff" : "#000000" },
        },
      })
    );
  }, [globalSlice.isDarkMode]);
  const calculatePieChartData = (): pieCharDataType[] => {
    let allSavingDataTotal = 0;
    const totalSavingDataToTl: pieCharDataType[] = [];
    Object.entries(homePageSlice.totalSavingData.totalSavings).map(
      ([key, value]) => {
        const exchangeRate =
          homePageSlice.currentExchangeRates[key as keyof exchangeDataType];
        const exchangeRateValue =
          exchangeRate && exchangeRate.Alış ? exchangeRate.Alış : 1;
        allSavingDataTotal += Math.round(value * exchangeRateValue);
      }
    );

    const data = Object.entries(homePageSlice.totalSavingData.totalSavings).map(
      ([key, value], index) => {
        const exchangeRate =
          homePageSlice.currentExchangeRates[key as keyof exchangeDataType];
        const exchangeRateValue =
          exchangeRate && exchangeRate.Alış ? exchangeRate.Alış : 1;

        const label = savingRowInformations.find((each) => each.type === key);
        totalSavingDataToTl.push({
          id: index,
          label: key,
          value: Math.round(value * exchangeRateValue),
        });

        return {
          id: index,
          label: label != undefined ? label.placeholder : "key",
          value: Math.round(
            ((value * exchangeRateValue) / allSavingDataTotal) * 100
          ),
        };
      }
    );

    settotalSavingDataAsTl(totalSavingDataToTl);
    return data.length > 0 ? data : [{ id: 0, label: "No Data", value: 1 }];
  };
  const calculateBarChartData = () => {
    getPerSavingsByUserId(globalSlice.userId).then(
      (response: serviceReturnType) => {
        // [{ data: [35, 15, 0, 25] }, { data: [51] }, { data: [15] }, { data: [60] }];
        if (response.statusCode == 200) {
          const barChartDataTypeTemp: barChartDataType[] = [];
          Object.entries(homePageSlice.totalSavingData.totalSavings).map(
            ([key]) => {
              const array = new Array(12).fill(0);
              const perSavings = response.data as perSavingsType[];
              const findedValues: perSavingsType[] = [];
              perSavings.map((each) => {
                if (each.type === key) {
                  findedValues.push(each);
                }
              });
              findedValues.map((eachFindedSavingData: perSavingsType) => {
                const date = new Date(eachFindedSavingData.date);
                array[date.getMonth()] += eachFindedSavingData.price;
              });

              barChartDataTypeTemp.push({
                data: array,
                label: returnDescriotionFromKey(key),
              });
            }
          );

          setBarChartData(barChartDataTypeTemp);
        }
      }
    );
  };

  useEffect(() => {
    setPieChartData(calculatePieChartData());
  }, [homePageSlice.currentExchangeRates]);
  useEffect(() => {
    setSavingsData(homePageSlice.totalSavingData);
    setPieChartData(calculatePieChartData());
  }, [homePageSlice.totalSavingData]);

  const clearValues = () => {
    setValues({
      gold14: 0,
      gold18: 0,
      gold22: 0,
      gold24: 0,
      dollar: 0,
      euro: 0,
      fon: 0,
      tl: 0,
      hisse: 0,
    });
  };

  const { handleChange, handleSubmit, errors, values, setValues } = useFormik({
    initialValues: {
      gold14: 0,
      gold18: 0,
      gold22: 0,
      gold24: 0,
      dollar: 0,
      euro: 0,
      fon: 0,
      tl: 0,
      hisse: 0,
    },
    validationSchema: addSavingsSchema,
    onSubmit: async () => {
      if (!savingsData) {
        return;
      }
      const object: totalSavingsType = {
        aimDate: savingsData?.aimDate,
        userId: savingsData?.userId,
        totalSavings: { ...savingsData.totalSavings } as totalSavingsObjectType,
      };
      Object.entries(values).map(([key, value]) => {
        if (value != 0) {
          if (isTotalSavingProcessAdding) {
            object.totalSavings[key as keyof totalSavingsObjectType] += value;
          } else {
            object.totalSavings[key as keyof totalSavingsObjectType] -= value;
          }
        }
      });

      const perObjectList: perSavingsType[] = [];
      Object.entries(values).map(([key, value]) => {
        if (value != 0) {
          perObjectList.push({
            type: key,
            price: isTotalSavingProcessAdding ? value : -value,
            date: Timestamp.now().toMillis(),
          } as perSavingsType);
        }
      });
      await UpdateTotalSavingsData(
        savingsData.documentId,
        object,
        perObjectList
      ).then((res: serviceReturnType) => {
        if (res.statusCode === 200) {
          dispatch(
            setTotalSavingData({
              ...object,
              documentId: savingsData.documentId,
            } as totalSavingTypeWithDocumentId)
          );
          calculateBarChartData();
          clearValues();
        }
      });
    },
  });

  if (savingsData == undefined || savingsData.totalSavings == undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full  h-full border flex  flex-col  bg-white  dark:bg-darkBackground max-xl:text-sm   ">
      <div className="w-full h-full flex max-sm:flex-col p-2 max-sm:p-1  ">
        <form
          className="w-[50%] h-full flex  flex-col max-sm:w-full justify-center "
          onSubmit={handleSubmit}
        >
          {Object.entries(savingsData.totalSavings).map(([key, value]) => {
            const text = savingRowInformations.find(
              (eachObject) => eachObject.type === key
            );
            return (
              <div
                className="flex p-4 w-full items-center justify-center   border-b-2  max-sm:p-1"
                key={key}
              >
                <div
                  className={` rounded flex flex-col justify-center items-center  w-[40%] h-full dark:text-white `}
                >
                  <p className="max-sm:text-xs">
                    {text?.placeholder}: {value.toString()} {text?.afterText}
                  </p>
                </div>  
                <InputComponent
                  type="number"
                  value={values[key as keyof totalSavingsObjectType]}
                  placeholder={text?.placeholder}
                  parentClassName="w-[25%]"
                  className={`${
                    errors.gold14 && "border-red-500"
                  } text-center  `}
                  name={key}
                  onChange={handleChange}
                />
                <div className=" w-[25%] h-full flex  items-center dark:text-white text-end ">
                  <p className=" w-full text-end max-sm:text-xs">
                    {changeNumberToThreeDigitsAndReturn(
                      getFloatValueAsFixed2(
                        value * calculateSavingDataToTl(key, homePageSlice)
                      )
                    )}{" "}
                    TL
                  </p>
                </div>
              </div>
            );
          })}

          <div className="flex p-4 w-full justify-center items-center  max-sm:p-2  ">
            <div className="  flex items-center justify-center gap-x-8  max-xl:gap-2 w-[75%] max-sm:gap-x-4 ">
              <ButtonComponent
                parentClassName=" w-20 "
                type="submit"
                text="Çıkar"
                onClick={() => {
                  setIsTotalSavingProcessAdding(false);
                }}
              />
              <ButtonComponent
                parentClassName=" w-20 "
                type="submit"
                text="Ekle"
                onClick={() => {
                  setIsTotalSavingProcessAdding(true);
                }}
              />
            </div>
            <div className="flex  items-center underline underline-offset-8 dark:text-white end  w-[25%] ">
              <p className=" w-full text-end max-sm:text-xs ">
                {changeNumberToThreeDigitsAndReturn(
                  calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice)
                )}{" "}
                TL
              </p>
            </div>
          </div>
        </form>

        <div className=" w-[50%] h-full flex flex-col p-4 max-sm:w-full ">
          <div className="w-full h-[50%] dark:text-white flex justify-center items-center border-b-4 max-sm:hidden   ">
            <ThemeProvider theme={themeState}>
              <PieChart
                title="Total Savings Ratio"
                className=" text-black dark:text-white   "
                series={
                  pieChartData.length > 0
                    ? [
                        {
                          data: pieChartData,
                          paddingAngle: 2,
                          innerRadius: 30,
                          outerRadius: 120,
                          cornerRadius: 10,
                          valueFormatter,
                          startAngle: -45,
                          highlightScope: { fade: "global", highlight: "item" },
                          faded: {
                            innerRadius: 30,
                            additionalRadius: -30,
                            color: "gray",
                          },
                        },
                      ]
                    : [
                        {
                          data: [{ id: 0, label: "No Data", value: 1 }],
                        },
                      ]
                }
              />
            </ThemeProvider>
          </div>
          <div className=" w-full h-[50%] max-sm:h-full ">
            <ThemeProvider theme={themeState}>
              <BarChart
                className="w-full h-full  "
                title="Savings Per Month"
                series={barChartData}
                xAxis={[{ data: monthNames(), scaleType: "band" }]}
              />
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SavingComponent;
