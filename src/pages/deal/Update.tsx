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
import React, { type SetStateAction, useMemo } from "react";
import { useFormik } from "formik";
import { Close } from "@mui/icons-material";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/utils/api";
import { ContactSchema, ContactType, DealSchema, DealType } from "@/utils/schema";
import { toast } from "react-toastify";
import { DealData } from ".";

type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  data: DealData;
};

export default function Update({ data, isOpen, setOpen }: Props) {
  const desktopBr = useMediaQuery("(min-width:600px)");
  const context = api.useContext();
  const { data: stages } = api.dictionary.byType.useQuery("DEAL_STAGE");
  const { membershipList } = useOrganization({
    membershipList: {},
  });
  const { data: leads } = api.lead.leads.useQuery();
  const { mutate: submit, isLoading: isCreating } = api.deal.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: async () => {
      toast.success("Deal updated");
      formik.resetForm();
      setOpen(false);
      await context.deal.deals.invalidate();
    },
  });

  const defaultOwner = useMemo(
    () => membershipList?.find((u) => u.publicUserData.userId === data.owner),
    [data.owner, membershipList]
  );

  const formik = useFormik({
    initialValues: {
      forecast: data.forecast,
      comment: data.comment ?? "",
      owner: {
        identifier: data.ownerFullname,
        userId: data.owner,
      },
      lead: data.leadId,
      stage: data.stage?.id,
      value: data.value ?? 0,
    } satisfies DealType,
    validationSchema: DealSchema,
    onSubmit: (values) => {
      submit({
        id: data.id,
        data: values,
      });
    },
    enableReinitialize: true,
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
          mt={desktopBr ? 4 : 2}
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
                    <TextField
                      fullWidth
                      required
                      id="forecast"
                      name="forecast"
                      label="Forecast"
                      value={formik.values.forecast}
                      onChange={formik.handleChange}
                      error={formik.touched.forecast && Boolean(formik.errors.forecast)}
                      helperText={formik.touched.forecast && formik.errors.forecast}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      id="value"
                      name="value"
                      label="Value"
                      defaultValue={data.value}
                      onChange={formik.handleChange}
                      error={formik.touched.value && Boolean(formik.errors.value)}
                      helperText={formik.touched.value && formik.errors.value}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      defaultValue={defaultOwner}
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
                      defaultValue={data.stage}
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
                      defaultValue={data.lead}
                      getOptionLabel={(option) => option.firstName + " " + option.lastName}
                      renderInput={(params) => <TextField {...params} id="lead" name="lead" label="Lead" />}
                      options={leads ?? []}
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
                    width: desktopBr ? "max-content" : "100%",
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
