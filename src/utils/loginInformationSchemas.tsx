import * as yup from "yup";

export const loginInformationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email formatında olması")
    .required("Email alanı boş bırakılamaz"),
  password: yup.string().min(5).max(20).required("Şifre alanı boş bırakılamaz"),
  passwordCheck: yup
    .string()
    .min(5, "Şifre tekrar en az 5 karakter olmalıdır.")
    .max(20, "Şifre tekrar en fazla 20 karakter olabilir.")
    .test(
      "password-check",
      "Şifre tekrar alanı boş bırakılamaz",
      function (value) {
        const { isRegistering } = this.parent;
        if (isRegistering) {
          return !!value && value.length > 0; // Eğer isRegistering true ise, passwordCheck zorunlu olur
        }
        return true; // Eğer isRegistering false ise, passwordCheck zorunlu değildir
      }
    ),
});

export const updateExpensesSchema = yup.object().shape({
  amount: yup.number().integer("Amount alanı sayı olmalıdır").min(0).required(),
  imageUrl: yup
    .string()
    .test(
      "is-url-or-base64",
      "Geçerli bir URL veya resim giriniz",
      function (value) {
        if (!value || value === "") return true; // Optional field
        // Check if it's a valid URL
        try {
          new URL(value);
          return true;
        } catch {
          // Check if it's a base64 image
          return value.startsWith("data:image/");
        }
      }
    )
    .optional()
    .nullable(),
  isRequired: yup.boolean(),
  name: yup.string().required("Name alanı boş bırakılamaz"),
  price: yup
    .number()
    .required("Price alanı boş bırakılamaz")
    .integer("Price alanı sayı olmalıdır"),
  rate: yup.number().integer("Rate alanı sayı olmalıdır").min(0).max(10),
});

export const addSavingsSchema = yup.object().shape({
  gold14: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  gold18: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  gold22: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  gold24: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  dollar: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  euro: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  fon: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  tl: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  hisse: yup
    .number()
    .min(0)
    .test(
      "is-decimal",
      "Gold 14 must have at most two decimal places",
      (value) =>
        value === undefined ||
        value === 0 ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
});
