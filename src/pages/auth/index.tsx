import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import React from "react";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import CenterLoad from "@/components/CenterLoad";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <CenterLoad />;
  }

  if (isSignedIn) {
    void router.push("/home");
    return <CenterLoad />;
  }

  return (
    <>
      <Head>
        <title>Efficient CRM login</title>
        <meta name="description" content="Login page for efficient crm" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@efficientcrm" />
        <meta name="twitter:creator" content="@PohlPawe" />
        <meta property="og:title" content="Login page for efficient crm" />
        <meta property="og:description" content="Login page for efficient crm" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Box mt={"4rem"} display="flex" alignItems={"center"} flexDirection={"column"}>
            <Box mb={"4rem"}>
              <Typography
                sx={{
                  display: "block",
                }}
                textAlign={"center"}
                variant="h2"
                component={"h1"}
                color={"secondary"}
              >
                Efficient CRM
              </Typography>
            </Box>
            <SignIn appearance={{ baseTheme: dark }} signUpUrl="/auth/signup" afterSignInUrl={"/home"} />
          </Box>
        </Container>
      </main>
    </>
  );
}
