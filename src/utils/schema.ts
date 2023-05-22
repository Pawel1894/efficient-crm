import * as yup from "yup";

export const ContactSchema = yup.object({
  firstName: yup.string().required("First name is required").max(50, "max characters is 50"),
  lastName: yup.string().required("Last name is required").max(50, "max characters is 50"),
  company: yup.string().optional().nullable(),
  title: yup.string().optional().nullable(),
  email: yup.string().email("Enter a valid email").required(),
  phone: yup.string().optional().nullable(),
  location: yup.string().optional().nullable(),
  comment: yup.string().optional().nullable(),
  owner: yup
    .object({
      identifier: yup.string().optional().nullable(),
      userId: yup.string().optional().nullable(),
    })
    .optional(),
  type: yup.string(),
});
