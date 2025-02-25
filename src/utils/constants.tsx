import { globalSlice } from "@/redux/slices/globalSlice";
import { savingComponentTextType } from "@/types/types";
import { createTheme } from "@mui/material";
const state = globalSlice.getInitialState();

export const savingRowInformations: savingComponentTextType[] = [
  {
    type: "gold14",
    placeholder: "Altın-14 ayar",
    afterText: "gram",
  },
  {
    type: "gold18",
    placeholder: "Altın-18 ayar",
    afterText: "gram",
  },
  {
    type: "gold22",
    placeholder: "Altın-22 ayar",
    afterText: "gram",
  },
  {
    type: "gold24",
    placeholder: "Altın-24 ayar",
    afterText: "gram",
  },
  {
    type: "dollar",
    placeholder: "Dolar",
    afterText: "$",
  },
  {
    type: "euro",
    placeholder: "Euro",
    afterText: "€",
  },
  {
    type: "fon",
    placeholder: "Fon",
    afterText: "₺",
  },
  {
    type: "tl",
    placeholder: "TL",
    afterText: "₺",
  },
  {
    type: "hisse",
    placeholder: "Hisse",
    afterText: "₺",
  },
];

export const monthNames = (): string[] => {
  return [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
};
export const theme = createTheme({
  palette: {
    mode: state.isDarkMode ? "dark" : "light",
  },
});
