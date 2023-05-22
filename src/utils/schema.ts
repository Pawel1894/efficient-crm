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

export type DealType = yup.InferType<typeof DealSchema>;
export type ContactType = yup.InferType<typeof ContactSchema>;
export type LeadType = yup.InferType<typeof LeadSchema>;
