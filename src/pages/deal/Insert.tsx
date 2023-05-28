import { api } from "@/utils/api";
import { DealSchema, DealType } from "@/utils/schema";
import { useOrganization } from "@clerk/nextjs";
import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import React, { type SetStateAction } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  leadId?: string;
};

export default function Insert({ isOpen, setOpen, leadId }: Props) {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const context = api.useContext();
  const { data: stages } = api.dictionary.byType.useQuery("DEAL_STAGE");
  const { membershipList } = useOrganization({
    membershipList: {},
  });
  const { data: leads } = api.lead.leads.useQuery();
  const { data: lead } = api.lead.get.useQuery(leadId, {
    onSuccess: (data) => {
      formik.setFieldValue("lead", data?.id);
    },
    enabled: !!leadId,
  });

  const { mutate: submit, isLoading: isCreating } = api.deal.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: async () => {
      toast.success("Contact created");
      formik.resetForm();
      setOpen(false);
      await context.deal.deals.invalidate();
    },
  });

  const formik = useFormik({
    initialValues: {
      forecast: null,
      comment: null,
      owner: {
        identifier: null,
        userId: null,
      },
      lead: null,
      stage: null,
      value: null,
    } satisfies DealType,
    validationSchema: DealSchema,
    onSubmit: (values) => {
      console.log("valuesvaluesvaluesvaluesvalues", values);
      submit(values);
    },
  });

  function onHiding() {
    setOpen(false);
    formik.resetForm();
  }

  return (
    <Modal sx={{ backgroundColor: "#202020" }} open={isOpen}>
      <>
        <Stack
          borderBottom={"1px solid"}
          borderColor={"primary.main"}
          direction={"row"}
          p={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6" component={"span"}>
            Create new deal
          </Typography>
          <IconButton size="large" onClick={onHiding}>
            <Close />
          </IconButton>
        </Stack>
        <Stack
          sx={{
            height: "calc(100vh - 70px)",
          }}
          mt={desktopbr ? 4 : 2}
          mb={4}
          mx={"auto"}
          p={1}
          overflow={"auto"}
          maxWidth={"1400px"}
        >
          {isCreating ? (
            <Stack alignItems={"center"}>
              <CircularProgress />
            </Stack>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Grid justifyContent={"center"} container rowGap={2}>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <NumericFormat
                      fullWidth
                      required
                      id="forecast"
                      name="forecast"
                      label="Forecast"
                      value={formik.values.forecast}
                      onValueChange={(values) => void formik.setFieldValue("forecast", values?.floatValue)}
                      error={formik.touched.forecast && Boolean(formik.errors.forecast)}
                      helperText={formik.touched.forecast && formik.errors.forecast}
                      customInput={TextField}
                      thousandSeparator
                      prefix={"$ "}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <NumericFormat
                      fullWidth
                      id="value"
                      name="value"
                      label="Value"
                      value={formik.values.value}
                      onValueChange={(values) => void formik.setFieldValue("value", values?.floatValue)}
                      error={formik.touched.value && Boolean(formik.errors.value)}
                      helperText={formik.touched.value && formik.errors.value}
                      customInput={TextField}
                      thousandSeparator
                      prefix={"$ "}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      getOptionLabel={(option) => option.publicUserData.identifier}
                      renderInput={(params) => (
                        <TextField {...params} id="owner" name="owner" label="Owner" />
                      )}
                      options={membershipList ?? []}
                      onChange={(e, value) =>
                        void formik.setFieldValue("owner", {
                          identifier: value?.publicUserData.identifier,
                          userId: value?.publicUserData.userId,
                        })
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      renderInput={(params) => (
                        <TextField {...params} id="stage" name="stage" label="Stage" />
                      )}
                      options={stages ?? []}
                      onChange={(e, value) => void formik.setFieldValue("stage", value?.id)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      getOptionLabel={(option) => option.firstName + " " + option.lastName}
                      renderInput={(params) => <TextField {...params} id="lead" name="lead" label="Lead" />}
                      options={leads ?? []}
                      defaultValue={lead}
                      disabled={!!lead}
                      onChange={(e, value) => void formik.setFieldValue("lead", value?.id)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      minRows={3}
                      multiline
                      id="comment"
                      name="comment"
                      label="Comment"
                      value={formik.values.comment}
                      onChange={formik.handleChange}
                      error={formik.touched.comment && Boolean(formik.errors.comment)}
                      helperText={formik.touched.comment && formik.errors.comment}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box px={1} my={3} display={"flex"}>
                <Button
                  sx={{
                    marginLeft: "auto",
                    width: desktopbr ? "max-content" : "100%",
                  }}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Create
                </Button>
              </Box>
            </form>
          )}
        </Stack>
      </>
    </Modal>
  );
}
