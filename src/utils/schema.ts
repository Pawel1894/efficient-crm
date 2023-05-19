import * as yup from "yup";

export const ContactSchema = yup.object({
  firstName: yup.string().required("First name is required").max(50, "max characters is 50"),
  lastName: yup.string().required("Last name is required").max(50, "max characters is 50"),
  company: yup.string().optional(),
  title: yup.string().optional(),
  email: yup.string().email("Enter a valid email").required(),
  phone: yup.string().optional(),
  location: yup.string().optional(),
  comment: yup.string().optional(),
  owner: yup
    .object({
      identifier: yup.string(),
      userId: yup.string(),
    })
    .optional(),
  type: yup.string(),
});
