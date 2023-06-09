import * as yup from "yup";

export const LeadSchema = yup.object({
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
  status: yup.string(),
});

export const DealSchema = yup.object({
  forecast: yup.number().required("Forecast is required"),
  value: yup.number().optional().nullable(),
  owner: yup
    .object({
      identifier: yup.string().optional().nullable(),
      userId: yup.string().optional().nullable(),
    })
    .optional(),
  stage: yup.string().optional().nullable(),
  comment: yup.string().optional().nullable(),
  lead: yup.string().optional().nullable(),
});

export const ActivitySchema = yup.object({
  owner: yup
    .object({
      identifier: yup.string().optional().nullable(),
      userId: yup.string().optional().nullable(),
    })
    .optional(),
  date: yup.date().required("Date is required"),
  status: yup.string().optional().nullable(),
  lead: yup.string().optional().nullable(),
  description: yup.string().optional().nullable(),
  title: yup.string().required("Title is required"),
  location: yup.string().optional().nullable(),
});

export const DictionarySchema = yup.object({
  label: yup.string().required("Label is required"),
  value: yup.string().required("Value is required"),
  type: yup.string().required("Type is required"),
});

export type DictionaryType = yup.InferType<typeof DictionarySchema>;
export type DealType = yup.InferType<typeof DealSchema>;
export type LeadType = yup.InferType<typeof LeadSchema>;
export type ActivityType = yup.InferType<typeof ActivitySchema>;
