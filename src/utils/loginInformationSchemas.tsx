import * as yup from "yup";

export const loginInformationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email formatında olması")
    .required("Email alanı boş bırakılamaz"),
  password: yup.string().min(5).max(20).required("Şifre alanı boş bırakılamaz"),
  checkbox: yup.boolean(),
});

export const updateExpensesSchema = yup.object().shape({
  amount: yup.number().integer("Amount alanı sayı olmalıdır"),
  imageUrl: yup.string().url("ImageUrl alanı url olmalıdır").required(),
  isRequired: yup.boolean(),
  name: yup.string().required("Name alanı boş bırakılamaz"),
  price: yup
    .number()
    .required("Price alanı boş bırakılamaz")
    .integer("Price alanı sayı olmalıdır"),
  rate: yup.number().integer("Rate alanı sayı olmalıdır").min(0).max(10),
});

export const addSavingsSchema = yup.object().shape({
  gold14: yup.number(),
  gold18: yup.number(),
  gold22: yup.number(),
  gold24: yup.number(),
  dollar: yup.number(),
  euro: yup.number(),
  fon: yup.number(),
  tl: yup.number(),
  hisse: yup.number(),
});
