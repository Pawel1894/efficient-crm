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
import { api } from "@/utils/api";
import { DictionarySchema, type DictionaryType } from "@/utils/schema";
import { toast } from "react-toastify";
import type { Dictionary } from "@prisma/client";

type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  data: Dictionary;
  onSettledHandler: () => Promise<void>;
};
export default function Update({ isOpen, setOpen, data, onSettledHandler }: Props) {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const context = api.useContext();

  const { mutate: submit, isLoading: isCreating } = api.dictionary.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: async () => {
      toast.success("Dictionary entry updated");
      formik.resetForm();
      setOpen(false);
      await context.dictionary.dictionaries.invalidate();
      await onSettledHandler();
    },
  });

  const formik = useFormik({
    initialValues: {
      label: data.label,
      type: data.type,
      value: data.value,
    } satisfies DictionaryType,
    validationSchema: DictionarySchema,
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
            Update {data?.label} for {data.type}
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
                <Grid item xs={12}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      required
                      id="label"
                      name="label"
                      label="Label"
                      value={formik.values.label}
                      onChange={formik.handleChange}
                      error={formik.touched.label && Boolean(formik.errors.label)}
                      helperText={formik.touched.label && formik.errors.label}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box px={1}>
                    <TextField
                      fullWidth
                      required
                      id="value"
                      name="value"
                      label="Value"
                      value={formik.values.value}
                      onChange={formik.handleChange}
                      error={formik.touched.value && Boolean(formik.errors.value)}
                      helperText={formik.touched.value && formik.errors.value}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box px={1}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      defaultValue={data.type}
                      renderInput={(params) => <TextField {...params} id="type" name="type" label="Type" />}
                      options={["ACTIVITY_STATUS", "DEAL_STAGE", "LEAD_STATUS"]}
                      onChange={(e, value) => void formik.setFieldValue("type", value)}
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
                  Update
                </Button>
              </Box>
            </form>
          )}
        </Stack>
      </>
    </Modal>
  );
}
