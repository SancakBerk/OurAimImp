"use client";
import {} from "@/services/userService";
import { expensesDataWithDocumentId, serviceReturnType } from "@/types/types";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ButtonComponent } from "@/components/ButtonComponent";
import {
  setCurrentExpenseData,
  setDeletePopUpConfirmation,
  setExpenseDataChanged,
  setPopupOpen,
} from "@/redux/slices/homePageSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Checkbox } from "@mui/material";
import {
  getUserExpensesByUserId,
  updateExpenseDataByDocumentId,
} from "@/services/expensesService";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FiSearch, FiFilter } from "react-icons/fi";
import { BiSortAlt2, BiSortUp, BiSortDown } from "react-icons/bi";
import "@/app/(routes)/Home/style.css";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useDragScroll } from '@/hooks/useDragScroll';
import { toast } from "react-toastify";
export const Expenses = () => {
  const dispatch = useDispatch();
  const { t } = useLocale();
  const scrollRef = useDragScroll();

  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [expensesData, setExpensesData] = useState<
    expensesDataWithDocumentId[]
  >([]);
  const [filteredData, setFilteredData] = useState<
    expensesDataWithDocumentId[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<"all" | "need" | "want">("all");
  const [showFilters, setShowFilters] = useState(false);

  const getExpenses = useCallback(async () => {
    if (!globalSlice.userId) return;
    
    await getUserExpensesByUserId(globalSlice.userId).then(
      (data: serviceReturnType) => {
        if (data.statusCode == 200) {
          setCurrentExpenseData(data.data as expensesDataWithDocumentId[]);
          setExpensesData(data.data as expensesDataWithDocumentId[]);
        }
      }
    );
  }, [globalSlice.userId]);

  useEffect(() => {
    if (homePageSlice.currentExpenseData.length > 0) {
      setExpensesData(homePageSlice.currentExpenseData);
    }
  }, [homePageSlice.currentExpenseData]);

  useEffect(() => {
    if (homePageSlice.expenseDataChanged) {
      getExpenses();
      dispatch(setExpenseDataChanged(false));
    }
  }, [homePageSlice.expenseDataChanged, getExpenses, dispatch]);

  useEffect(() => {
    setExpensesData(homePageSlice.currentExpenseData);
    setFilteredData(homePageSlice.currentExpenseData);
  }, [homePageSlice.currentExpenseData]);

  useEffect(() => {
    let result = [...expensesData];

    // Search filter
    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((item) =>
        filterType === "need" ? item.isRequired : !item.isRequired
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        const priceA = a.price * a.amount * homePageSlice.currentExchangeRates.dollar.Alış;
        const priceB = b.price * b.amount * homePageSlice.currentExchangeRates.dollar.Alış;
        comparison = priceA - priceB;
      } else {
        comparison = a.rate - b.rate;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredData(result);
  }, [searchQuery, sortBy, sortOrder, filterType, expensesData, homePageSlice.currentExchangeRates]);

  return (
    <div
      className={`${
        globalSlice.isDarkMode && "dark"
      } relative w-full h-screen`}
    >
      <div ref={scrollRef} className="w-full h-screen overflow-y-scroll relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-2 sm:p-4">
          <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2 sm:gap-3 items-center">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
                <input
                  type="text"
                  placeholder={t('expenses.search') || 'Ürün ara...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 sm:p-3 rounded-lg border transition-all ${
                  showFilters
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiFilter className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-3"
              >
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <BiSortAlt2 className="text-gray-600 dark:text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rate")}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">{t('expenses.sortByName') || 'İsme Göre'}</option>
                    <option value="price">{t('expenses.sortByPrice') || 'Fiyata Göre'}</option>
                    <option value="rate">{t('expenses.sortByRate') || 'Dereceye Göre'}</option>
                  </select>
                  
                  {/* Sort Order Toggle */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    title={sortOrder === 'asc' ? (t('expenses.ascending') || 'Artan') : (t('expenses.descending') || 'Azalan')}
                  >
                    {sortOrder === 'asc' ? (
                      <BiSortUp className="text-xl" />
                    ) : (
                      <BiSortDown className="text-xl" />
                    )}
                  </button>
                </div>

                {/* Filter Type */}
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      filterType === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('expenses.all') || 'Tümü'}
                  </button>
                  <button
                    onClick={() => setFilterType('need')}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      filterType === 'need'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('expenses.need') || 'İhtiyaç'}
                  </button>
                  <button
                    onClick={() => setFilterType('want')}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      filterType === 'want'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('expenses.want') || 'İstek'}
                  </button>
                </div>

                {/* Results Count */}
                <div className="ml-auto flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{filteredData.length}</span>
                  <span className="ml-1">{t('expenses.results') || 'sonuç'}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex flex-wrap justify-center p-6 lg:p-10 sm:px-4 px-2 gap-6 sm:gap-4">
        {filteredData.map((eachData: expensesDataWithDocumentId) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card card-hover w-full lg:w-[calc(50%-1.5rem)] xl:w-[calc(45%-1.5rem)] h-auto max-h-[600px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
              key={eachData.documentId}
            >
              {/* Image Section */}
              <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                {eachData.imageUrl ? (
                  <Image
                    loading="lazy"
                    src={eachData.imageUrl}
                    alt={eachData.name}
                    fill
                    className="object-contain hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-20 h-20 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Resim Yok</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                    {eachData.name.toUpperCase()}
                  </h3>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`${
                      eachData.isRequired
                        ? "bg-blue-500"
                        : "bg-gray-400 dark:bg-gray-600"
                    } px-2 sm:px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-medium whitespace-nowrap`}
                  >
                    {eachData.isRequired ? "İhtiyaç" : "İstek"}
                  </motion.div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium">İstek Derecesi:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {eachData.rate}/10
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium">Toplam Ücret:</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {(
                          eachData.price *
                          homePageSlice.currentExchangeRates.dollar.Alış *
                          eachData.amount
                        ).toFixed(0)}{" "}
                        TL
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(
                          eachData.price *
                          homePageSlice.currentExchangeRates.dollar.Alış
                        ).toFixed(0)}{" "}
                        × {eachData.amount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium">Hesaplamaya Dahil:</span>
                    <Checkbox
                      checked={eachData.isCalculating}
                      color="success"
                      size="small"
                      onChange={async (e) => {
                        try {
                          await updateExpenseDataByDocumentId(
                            eachData.documentId,
                            {
                              amount: eachData.amount,
                              imageUrl: eachData.imageUrl,
                              isCalculating: e.target.checked,
                              isRequired: eachData.isRequired,
                              name: eachData.name,
                              price: eachData.price,
                              rate: eachData.rate,
                              userId: eachData.userId,
                            }
                          );
                          dispatch(setExpenseDataChanged(true));
                          toast.success(
                            e.target.checked
                              ? "Ürün hesaplamaya dahil edildi!"
                              : "Ürün hesaplamadan çıkarıldı!"
                          );
                        } catch {
                          toast.error("İşlem sırasında bir hata oluştu.");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <ButtonComponent
                  className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-red-200 dark:border-red-800"
                  onClick={() => {
                    dispatch(
                      setDeletePopUpConfirmation({
                        deleteExpenseData: eachData,
                        showDeletePopUp: true,
                      })
                    );
                  }}
                >
                  <p className="text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm">
                    Sil
                  </p>
                </ButtonComponent>
                <ButtonComponent
                  className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-800"
                  onClick={() => {
                    dispatch(
                      setPopupOpen({
                        isPopupOpen: true,
                        isUpdate: true,
                        expenseData: eachData,
                      })
                    );
                  }}
                >
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">
                    Güncelle
                  </p>
                </ButtonComponent>
              </div>
            </motion.div>
          );
        })}

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="card card-hover w-full lg:w-[calc(50%-1.5rem)] xl:w-[calc(45%-1.5rem)] min-h-[400px] flex items-center justify-center cursor-pointer group"
          onClick={() => {
            dispatch(
              setPopupOpen({
                isPopupOpen: true,
                isUpdate: false,
                expenseData: undefined,
              })
            );
          }}
        >
          <div className="text-center p-8">
            <MdOutlineAddCircleOutline className="text-7xl sm:text-8xl text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              Yeni Ürün Ekle
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Expenses;
