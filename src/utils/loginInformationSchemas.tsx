import * as yup from "yup";

export const loginInformationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email formatında olması")
    .required("Email alanı boş bırakılamaz"),
  password: yup.string().min(5).max(20).required("Şifre alanı boş bırakılamaz"),
  checkbox: yup.boolean(),
});
