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
import React, { JSX, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { useDragScroll } from "@/hooks/useDragScroll";

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
  const [showMonthlyChart, setShowMonthlyChart] = useState(false);
  const [showChartsOnMobile, setShowChartsOnMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const valueFormatter = (item: { value: number }) => ` ${item.value}% `;
  const leftScrollRef = useDragScroll();
  const rightScrollRef = useDragScroll();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const calculateBarChartData = useCallback(() => {
    if (!globalSlice.userId || globalSlice.userId.trim() === '') {
      console.warn('⚠️ Saving - userId is empty, skipping calculateBarChartData');
      return;
    }
    
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
  }, [globalSlice.userId, homePageSlice.totalSavingData]);

  useEffect(() => {
    setSavingsData(homePageSlice.totalSavingData);
    calculateBarChartData();
  }, [globalSlice.userId, calculateBarChartData, homePageSlice.totalSavingData]);
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
  const calculatePieChartData = useCallback((): pieCharDataType[] => {
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
  }, [homePageSlice.totalSavingData, homePageSlice.currentExchangeRates]);

  useEffect(() => {
    setPieChartData(calculatePieChartData());
  }, [homePageSlice.currentExchangeRates, calculatePieChartData]);
  useEffect(() => {
    setSavingsData(homePageSlice.totalSavingData);
    setPieChartData(calculatePieChartData());
  }, [homePageSlice.totalSavingData, calculatePieChartData]);

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

  const { handleChange, handleSubmit, values, setValues } = useFormik({
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
          toast.success(
            isTotalSavingProcessAdding
              ? "Birikim başarıyla eklendi!"
              : "Birikim başarıyla çıkarıldı!"
          );
        } else {
          toast.error("Birikim işlemi sırasında bir hata oluştu.");
        }
      }).catch((error) => {
        console.error("Saving error:", error);
        toast.error("Birikim işlemi sırasında bir hata oluştu.");
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
        <div ref={leftScrollRef} className="w-full lg:w-2/3 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <form
            className="p-6 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Birikim Yönetimi
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Birikimlerinizi ekleyin veya çıkarın
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChartsOnMobile(!showChartsOnMobile)}
                  className="lg:hidden px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                >
                  {showChartsOnMobile ? '📊 Gizle' : '📊 Grafikler'}
                </button>
              </div>
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
        <div ref={rightScrollRef} className={`${showChartsOnMobile ? 'block' : 'hidden'} lg:block lg:w-1/3 w-full h-full overflow-y-auto p-3 sm:p-6 bg-gray-50 dark:bg-gray-900/50`}>
          <div className="space-y-4 sm:space-y-6">
            {/* Pie Chart */}
            <div className="card p-3 sm:p-6 hidden lg:block">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Birikim Dağılımı
              </h3>
              <div className="flex justify-center overflow-x-auto">
                <ThemeProvider theme={themeState}>
                  <PieChart
                    width={isMobile ? Math.min(350, window.innerWidth - 60) : 400}
                    height={isMobile ? 250 : 300}
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
                    slotProps={{
                      legend: {
                        direction: isMobile ? 'column' : 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        labelStyle: { fontSize: isMobile ? 9 : 10 },
                        itemMarkHeight: isMobile ? 8 : 10,
                        itemMarkWidth: isMobile ? 8 : 10,
                        padding: isMobile ? 1 : 2,
                        itemGap: isMobile ? 4 : 8,
                      },
                    }}
                    margin={{
                      left: isMobile ? 10 : 20,
                      right: isMobile ? 10 : 20,
                      top: isMobile ? 10 : 20,
                      bottom: isMobile ? 80 : 60,
                    }}
                  />
                </ThemeProvider>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Aylık Birikim Grafiği
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMonthlyChart(!showMonthlyChart)}
                  className="lg:hidden px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  {showMonthlyChart ? 'Gizle' : 'Göster'}
                </button>
              </div>
              <div className={`${showMonthlyChart ? 'block' : 'hidden'} lg:block overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0`}>
                <div className="min-w-[300px]">
                  <ThemeProvider theme={themeState}>
                    <BarChart
                      height={300}
                      series={barChartData}
                      xAxis={[
                        {
                          data: monthNamesShort,
                          scaleType: "band",
                          tickLabelStyle: { 
                            fontSize: isMobile ? 9 : 11,
                            angle: isMobile ? -45 : 0,
                          },
                        },
                      ]}
                      yAxis={[
                        {
                          tickLabelStyle: { fontSize: isMobile ? 9 : 11 },
                        },
                      ]}
                      slotProps={{
                        legend: {
                          direction: isMobile ? 'column' : 'row',
                          position: { vertical: 'top', horizontal: 'left' },
                          labelStyle: { fontSize: isMobile ? 9 : 11 },
                          itemMarkHeight: isMobile ? 8 : 12,
                          itemMarkWidth: isMobile ? 8 : 12,
                          padding: isMobile ? 2 : 5,
                          itemGap: isMobile ? 3 : 5,
                        },
                      }}
                      margin={{
                        left: isMobile ? 35 : 50,
                        right: isMobile ? 10 : 20,
                        top: isMobile ? 100 : 50,
                        bottom: isMobile ? 70 : 50,
                      }}
                    />
                  </ThemeProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SavingComponent;
