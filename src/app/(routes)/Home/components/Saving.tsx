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

const monthNamesShort = monthNames().map((each: string) => each.slice(0, 3));

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
    <div className="w-full h-full glass-effect flex flex-col overflow-hidden">
      <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <form
            className="p-6 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Birikim Yönetimi
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Birikimlerinizi ekleyin veya çıkarın
              </p>
            </div>

            {/* Savings Inputs */}
            <div className="space-y-3">
              {Object.entries(savingsData.totalSavings).map(([key, value]) => {
                const text = savingRowInformations.find(
                  (eachObject) => eachObject.type === key
                );
                return (
                  <div
                    className="card p-4 hover:shadow-lg transition-shadow"
                    key={key}
                  >
                    <div className="flex items-center gap-3">
                      {/* Current Value */}
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {text?.placeholder}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {value.toString()} {text?.afterText}
                        </p>
                      </div>

                      {/* Input */}
                      <div className="w-24">
                        <InputComponent
                          type="number"
                          value={values[key as keyof totalSavingsObjectType]}
                          placeholder="0"
                          parentClassName="w-full"
                          className="text-center text-sm py-2"
                          name={key}
                          onChange={handleChange}
                        />
                      </div>

                      {/* TL Value */}
                      <div className="w-28 text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          TL Değeri
                        </p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {changeNumberToThreeDigitsAndReturn(
                            getFloatValueAsFixed2(
                              value * calculateSavingDataToTl(key, homePageSlice)
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total and Actions */}
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 sticky bottom-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Toplam Birikim
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {changeNumberToThreeDigitsAndReturn(
                    calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice)
                  )}{" "}
                  TL
                </span>
              </div>

              <div className="flex gap-3">
                <ButtonComponent
                  variant="danger"
                  type="submit"
                  className="flex-1"
                  text="Çıkar"
                  onClick={() => {
                    setIsTotalSavingProcessAdding(false);
                  }}
                />
                <ButtonComponent
                  variant="primary"
                  type="submit"
                  className="flex-1"
                  text="Ekle"
                  onClick={() => {
                    setIsTotalSavingProcessAdding(true);
                  }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Charts */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="card p-6 hidden lg:block">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Birikim Dağılımı
              </h3>
              <div className="flex justify-center">
                <ThemeProvider theme={themeState}>
                  <PieChart
                    width={400}
                    height={300}
                    series={
                      pieChartData.length > 0
                        ? [
                            {
                              data: pieChartData,
                              paddingAngle: 2,
                              innerRadius: 40,
                              outerRadius: 100,
                              cornerRadius: 8,
                              valueFormatter,
                              highlightScope: { fade: "global", highlight: "item" },
                            },
                          ]
                        : [
                            {
                              data: [{ id: 0, label: "Veri Yok", value: 1 }],
                            },
                          ]
                    }
                  />
                </ThemeProvider>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Aylık Birikim Grafiği
              </h3>
              <ThemeProvider theme={themeState}>
                <BarChart
                  height={300}
                  series={barChartData}
                  xAxis={[
                    {
                      data: monthNamesShort,
                      scaleType: "band",
                      tickLabelStyle: { fontSize: 11 },
                    },
                  ]}
                  yAxis={[
                    {
                      tickLabelStyle: { fontSize: 11 },
                    },
                  ]}
                  slotProps={{
                    legend: {
                      labelStyle: { fontSize: 11 },
                      itemMarkHeight: 12,
                      itemMarkWidth: 12,
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SavingComponent;
