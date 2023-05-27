import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { type SetStateAction } from "react";
import { useFormik } from "formik";
import { Close } from "@mui/icons-material";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/utils/api";
import { ActivitySchema, type ActivityType } from "@/utils/schema";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DateTimeField } from "@mui/x-date-pickers";

type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  leadId?: string;
};

export default function Insert({ setOpen, isOpen, leadId }: Props) {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const context = api.useContext();
  const { data: statuses } = api.dictionary.byType.useQuery("ACTIVITY_STATUS");
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

  const { mutate: submit, isLoading: isCreating } = api.activity.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: async () => {
      toast.success("Activity created");
      formik.resetForm();
      setOpen(false);
      await context.activity.activities.invalidate();
    },
  });

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      status: null,
      title: "",
      lead: null,
      description: null,
      location: null,
      owner: {
        identifier: null,
        userId: null,
      },
    } satisfies ActivityType,
    validationSchema: ActivitySchema,
    onSubmit: (values) => {
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
            Create new activity
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
                    <TextField
                      fullWidth
                      required
                      id="title"
                      name="title"
                      label="Title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <DateTimeField
                      format="DD/MM/YYYY HH:mm"
                      fullWidth
                      required
                      id="date"
                      name="date"
                      label="Date"
                      helperText={formik.touched.title && formik.errors.title}
                      value={dayjs(formik.values.date.toString())}
                      onChange={(value) => void formik.setFieldValue("date", value?.toDate(), true)}
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
                        <TextField {...params} id="status" name="status" label="Status" />
                      )}
                      options={statuses ?? []}
                      onChange={(e, value) => void formik.setFieldValue("status", value?.id)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <Autocomplete
                      getOptionLabel={(option) => option.firstName + " " + option.lastName}
                      fullWidth
                      disablePortal
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
                      id="location"
                      name="location"
                      label="Location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={formik.touched.location && formik.errors.location}
                    />
                  </Box>
                </Grid>
                <Grid sx={{ marginLeft: "auto" }} gridColumn={2} item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      multiline={true}
                      minRows={3}
                      id="description"
                      name="description"
                      label="Description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
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
