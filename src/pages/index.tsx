import { Box, Button, Container, Fade, Typography, useMediaQuery } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import handleViewport, { type InjectedViewportProps } from "react-in-viewport";
import { grey } from "@mui/material/colors";
import Link from "next/link";
import logo from "../assets/logo.png";
import landingImg from "../assets/person-writing-on-mac.svg";

function AboutBlock(props: InjectedViewportProps<HTMLDivElement>) {
  const { inViewport, forwardedRef } = props;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!visible && inViewport) setVisible(true);
  }, [inViewport, visible]);
  return (
    <Fade ref={forwardedRef} in={visible} timeout={1200}>
      <Box
        mt={"5rem"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component={"h2"}
          sx={{
            textAlign: {
              xs: "left",
              md: "center",
            },
          }}
        >
          What is Efficient CRM?
        </Typography>
        <Typography color={grey[400]} component={"p"} textAlign={"justify"} maxWidth={"60ch"}>
          {`Happy to have you here! This CRM service was implemented for portfolio and practice purposes. It is a full stack app made using T3-stack and MUI library. If you want to see more of my projects, check out `}
          <Link style={{ textDecoration: "unset" }} href="https://github.com/Pawel1894">
            <Typography color={"primary.main"} component={"span"}>
              my github.
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Fade>
  );
}

const IntersectAboutBlock = handleViewport(AboutBlock, {
  rootMargin: "-80.0px",
}) as React.FC;

const Home: NextPage = () => {
  const desktopbr = useMediaQuery("(min-width:600px)");

  return (
    <>
      <Head>
        <title>Efficient CRM landingpage</title>
        <meta name="description" content="Crm application created using Efficient CRM stack and mui" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@efficientcrm" />
        <meta name="twitter:creator" content="@PohlPawe" />
        <meta property="og:title" content="Crm application created using Efficient CRM stack and mui" />
        <meta property="og:description" content="Crm application created using Efficient CRM stack and mui" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Box py={"1rem"}>
          <Container>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Image width={80} height={21} src={logo.src} alt="Crm app logo" />
              <div>
                <Link href={"/auth"}>
                  <Button color="primary">Login</Button>
                </Link>
              </div>
            </Box>
          </Container>
        </Box>
      </header>
      <main>
        <Container>
          <Box
            sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
              height: {
                xs: "calc(100vh - 132px)",
                md: "auto",
              },
              gap: {
                xs: "1.5rem",
                md: "3rem",
              },
              py: {
                xs: "2rem",
                md: "4rem",
              },
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
            }}
            gap={"1.5rem"}
            display={"grid"}
            alignItems={"center"}
          >
            <Fade in={true} appear={true} timeout={800}>
              <Box display={"flex"} flexDirection={"column"} gap={"1.5rem"}>
                <Typography
                  sx={{
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                  }}
                  variant="h2"
                  component={"h1"}
                >
                  Be quick with
                  <Typography
                    sx={{
                      textAlign: {
                        xs: "center",
                        md: "left",
                      },
                      display: "block",
                    }}
                    variant="h2"
                    component={"span"}
                    color={"secondary"}
                  >
                    Efficient CRM
                  </Typography>
                </Typography>

                <Typography
                  sx={{
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                    fontSize: {
                      xs: "16px",
                      md: "20px",
                    },
                    maxWidth: {
                      md: "40ch",
                    },
                  }}
                  variant="body2"
                  component={"p"}
                  color={grey["300"]}
                >
                  Simple and efficient CRM application created using modern tools.
                </Typography>
                <Link style={{ width: desktopbr ? "fit-content" : "100%" }} href={"/auth"}>
                  <Button
                    sx={{
                      width: {
                        xs: "100%",
                        md: "max-content",
                      },
                      marginInline: {
                        xs: "auto",
                        md: "unset",
                      },
                      marginTop: {
                        xs: "5rem",
                        md: "0",
                      },
                      fontSize: {
                        xs: "1rem",
                      },
                      paddingInline: "1.875rem",
                    }}
                    variant="contained"
                  >
                    Get started
                  </Button>
                </Link>
              </Box>
            </Fade>
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                style={{ maxWidth: "100%" }}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                src={landingImg.src}
                alt="Photo of a person writing on a laptop"
              />
            </Box>
          </Box>
        </Container>
        <Container>
          <Box sx={{ height: "1px" }} bgcolor={"primary.light"}></Box>
          <IntersectAboutBlock />
        </Container>
      </main>
      <footer>
        <Box marginTop={"5rem"} py={"1rem"}>
          <Container>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
              <Typography>&copy; 2023 Paweł Pohl</Typography>
            </Box>
          </Container>
        </Box>
      </footer>
    </>
  );
};

export default Home;
