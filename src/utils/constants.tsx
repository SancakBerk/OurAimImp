import { savingComponentTextType } from "@/types/types";

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
