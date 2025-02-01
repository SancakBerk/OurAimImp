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
import React, { JSX, use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPerSavingsByUserId,
  getTotalSavingDataById,
  UpdateTotalSavingsData,
} from "@/services/savingService";
import { InputComponent } from "@/components/InputComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useFormik } from "formik";
import { addSavingsSchema } from "@/utils/loginInformationSchemas";
import { monthNames, savingRowInformations } from "@/utils/constants";
import { Timestamp } from "firebase/firestore";
import { PieChart } from "@mui/x-charts/PieChart";
import { setTotalSavingData } from "@/redux/slices/homePageSlice";
import {
  calculateSavingDataToTl,
  calculateTotalSavingsAsTlRateAndReturnObjects,
  capitalizeWords,
  changeNumberToThreeDigitsAndReturn,
  getFloatValueAsFixed2,
  removeNumberCommasAndDotThenReturnNumber,
  returnDescriotionFromKey,
  sortObjectAlphabetically,
} from "@/utils/helperFunctions";
import { BarChart } from "@mui/x-charts/BarChart";
export const SavingComponent = (): JSX.Element => {
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const [pieChartData, setPieChartData] = useState<pieCharDataType[]>([]);

  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [exchangeDatas, setExchangeDatas] = useState<exchangeDataType>(
    homePageSlice.currentExchangeRates
  );
  const [totalSavingDataAsTl, settotalSavingDataAsTl] = useState<
    pieCharDataType[]
  >([]);
  const [savingsData, setSavingsData] =
    useState<totalSavingTypeWithDocumentId | null>(null);
  const [isTotalSavingProcessAdding, setIsTotalSavingProcessAdding] =
    useState(true);
  const dispatch = useDispatch();
  const valueFormatter = (item: { value: number }) => ` ${item.value}% `;
  useEffect(() => {
    functionsWhenComponentMount();
  }, []);
  useEffect(() => {
    functionsWhenComponentMount();
  }, [globalSlice.userId]);
  const calculatePieChartData = (): pieCharDataType[] => {
    var allSavingDataTotal = 0;
    var totalSavingDataToTl: pieCharDataType[] = [];
    Object.entries(homePageSlice.totalSavingData.totalSavings).map(
      ([key, value], index) => {
        var exchangeRate =
          homePageSlice.currentExchangeRates[key as keyof exchangeDataType];
        const exchangeRateValue =
          exchangeRate && exchangeRate.Alış
            ? removeNumberCommasAndDotThenReturnNumber(exchangeRate.Alış)
            : 1;
        allSavingDataTotal += Math.round(value * exchangeRateValue);
      }
    );

    var data = Object.entries(homePageSlice.totalSavingData.totalSavings).map(
      ([key, value], index) => {
        var exchangeRate =
          homePageSlice.currentExchangeRates[key as keyof exchangeDataType];
        var exchangeRateValue =
          exchangeRate && exchangeRate.Alış
            ? removeNumberCommasAndDotThenReturnNumber(exchangeRate.Alış)
            : 1;

        var label = savingRowInformations.find((each) => each.type === key);
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

  const functionsWhenComponentMount = () => {
    getTotalSavingDataById(globalSlice.userId).then(
      (res: serviceReturnType) => {
        if (
          res.statusCode === 200 &&
          res.data != undefined &&
          res.data.length != 0
        ) {
          var data = res.data[0] as totalSavingTypeWithDocumentId;
          var sorted = sortObjectAlphabetically(data.totalSavings);
          var obj: totalSavingTypeWithDocumentId = {
            aimDate: data.aimDate,
            userId: data.userId,
            documentId: data.documentId,
            totalSavings: sorted as totalSavingsObjectType,
          };
          setSavingsData(obj);
          dispatch(setTotalSavingData(obj as totalSavingTypeWithDocumentId));
          getPerSavingsByUserId(globalSlice.userId).then(
            (response: serviceReturnType) => {
              // [{ data: [35, 15, 0, 25] }, { data: [51] }, { data: [15] }, { data: [60] }];
              if (response.statusCode == 200) {
                Object.entries(homePageSlice.totalSavingData.totalSavings).map(
                  ([key, value]) => {
                    var array = new Array(12).fill(0);
                    var perSavings = response.data as perSavingsType[];
                    var findedValues: perSavingsType[] = [];
                    perSavings.map((each) => {
                      if (each.type === key) {
                        findedValues.push(each);
                      }
                    });
                    findedValues.map((eachFindedSavingData: perSavingsType) => {
                      var date = new Date(eachFindedSavingData.date);
                      array[date.getMonth()] += eachFindedSavingData.price;
                    });
                    barChartData.push({
                      data: array,
                      label: returnDescriotionFromKey(key),
                    });
                  }
                );

                setBarChartData(barChartData);
              }
            }
          );
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
  const calculateTotalSavingsAsTlRateAndReturnNumber = (): number => {
    var total = 0;
    calculateTotalSavingsAsTlRateAndReturnObjects(homePageSlice).map(
      (each: pieCharDataType) => {
        total += each.value;
      }
    );
    return total;
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
      var object: totalSavingsType = {
        aimDate: savingsData?.aimDate,
        userId: savingsData?.userId,
        totalSavings: { ...savingsData.totalSavings } as totalSavingsObjectType,
      };
      Object.entries(values).map(([key, value]) => {
        if (value != 0) {
          {
            isTotalSavingProcessAdding
              ? (object.totalSavings[key as keyof totalSavingsObjectType] +=
                  value)
              : object.totalSavings[key as keyof totalSavingsObjectType] -
                  value >
                0
              ? (object.totalSavings[key as keyof totalSavingsObjectType] -=
                  value)
              : (object.totalSavings[key as keyof totalSavingsObjectType] = 0);
          }
        }
      });

      var perObjectList: perSavingsType[] = [];
      Object.entries(values).map(([key, value]) => {
        if (value != 0) {
          perObjectList.push({
            type: key,
            price: value,
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
          clearValues();
        }
      });
    },
  });

  if (savingsData == undefined || savingsData.totalSavings == undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full  h-full border flex flex-col dark:bg-darkBackground p-10 ">
      <div className="w-full h-full flex">
        <form
          className="w-[50%] h-full flex justify-between flex-col"
          onSubmit={handleSubmit}
        >
          {Object.entries(savingsData.totalSavings).map(([key, value]) => {
            var text = savingRowInformations.find(
              (eachObject) => eachObject.type === key
            );
            return (
              <div
                className="flex p-4 w-full items-center justify-between   border-b-4 "
                key={key}
              >
                <div
                  className={` rounded flex flex-col justify-center items-center  w-[40%] h-full dark:text-white`}
                >
                  <p>
                    {text?.placeholder}: {value.toString()} {text?.afterText}
                  </p>
                </div>
                <InputComponent
                  type="number"
                  value={values[key as keyof totalSavingsObjectType]}
                  placeholder={text?.placeholder}
                  parentClassName="w-[25%]"
                  className={`${errors.gold14 && "border-red-500"} text-center`}
                  name={key}
                  onChange={handleChange}
                />
                <div className=" w-[25%] h-full flex  items-center dark:text-white">
                  <p>
                    {changeNumberToThreeDigitsAndReturn(
                      value * calculateSavingDataToTl(key, homePageSlice)
                    )}
                    TL
                  </p>
                </div>
              </div>
            );
          })}

          <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
            <div className=" w-[75%] flex items-center justify-center gap-x-8">
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
            <div className="w-[25%] flex  items-center underline underline-offset-8 dark:text-white">
              {changeNumberToThreeDigitsAndReturn(
                calculateTotalSavingsAsTlRateAndReturnNumber()
              )}
              {" TL"}
            </div>
          </div>
        </form>

        <div className=" w-[50%] h-full flex flex-col p-4">
          <div className="w-full h-[50%] dark:text-white  ">
            <PieChart
              title="Total Savings Ratio"
              className=" text-black dark:text-white  "
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
          </div>
          <div className=" w-full h-[50%] ">
            <BarChart
              className="w-full h-full  "
              title="Savings Per Month"
              series={barChartData}
              xAxis={[{ data: monthNames(), scaleType: "band" }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SavingComponent;
