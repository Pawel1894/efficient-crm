import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import "@/styles/globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { dark } from "@clerk/themes";
import Layout from "@/components/Layout";
import { ToastContainer } from "react-toastify";
import "@/styles/react-toastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      light: "#ff8a65",
      main: "#ff7043",
      dark: "#ff5722",
      contrastText: "#000",
    },
  },
});

export interface SystemSlice {
  breadcrumbs: JSX.Element | null;
  setBreadcrumbs: (value: JSX.Element) => void;
}

export const systemStore = createStore<SystemSlice>()((set) => ({
  breadcrumbs: null,
  setBreadcrumbs: (value: JSX.Element) => set((_) => ({ breadcrumbs: value })),
}));

export function useSystemStore(): SystemSlice;
export function useSystemStore<T>(selector: (state: SystemSlice) => T, equals?: (a: T, b: T) => boolean): T;
export function useSystemStore<T>(selector?: (state: SystemSlice) => T, equals?: (a: T, b: T) => boolean) {
  return useStore(systemStore, selector!, equals);
}

const unprotectedPaths = ["/", "/auth", "/auth/signup", "/auth/signin"];

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {unprotectedPaths.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
          <ReactQueryDevtools initialIsOpen={false} />
        </LocalizationProvider>
      </ThemeProvider>
      <ToastContainer position="top-center" autoClose={3000} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
