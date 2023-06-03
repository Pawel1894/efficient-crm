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
import React, { type SetStateAction } from "react";
import { useFormik } from "formik";
import { Close } from "@mui/icons-material";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/utils/api";
import { LeadSchema, type LeadType } from "@/utils/schema";
import { toast } from "react-toastify";

type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

export default function Insert({ setOpen, isOpen }: Props) {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const context = api.useContext();
  const { data: statuses } = api.dictionary.byType.useQuery("LEAD_STATUS");
  const { membershipList } = useOrganization({
    membershipList: {},
  });
  const { mutate: submit, isLoading: isCreating } = api.lead.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: async () => {
      toast.success("Lead created");
      formik.resetForm();
      setOpen(false);
      await context.lead.leads.invalidate();
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      company: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      comment: "",
      owner: {
        identifier: "",
        userId: "",
      },
      status: "",
    } satisfies LeadType,
    validationSchema: LeadSchema,
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
            Create new lead
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
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      required
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      required
                      id="email"
                      name="email"
                      label="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      id="company"
                      name="company"
                      label="Company"
                      value={formik.values.company}
                      onChange={formik.handleChange}
                      error={formik.touched.company && Boolean(formik.errors.company)}
                      helperText={formik.touched.company && formik.errors.company}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box px={1}>
                    <TextField
                      fullWidth
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
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
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
