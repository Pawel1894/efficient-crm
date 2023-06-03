import { Box, Button, Container, Fade, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import handleViewport, { type InjectedViewportProps } from "react-in-viewport";
import { grey } from "@mui/material/colors";
import Link from "next/link";

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
          {`I\'m happy to see you here! This crm service was implemented for portfolio and practice
              purpose. It is fullstack app made with T3-stack and mui library. If you want to see more of
              my projects check out `}
          <Link style={{ textDecoration: "unset" }} href="https://github.com/Pawel1894">
            <Typography color={"primary.main"} component={"span"}>
              my github
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
              <div>🍕</div>
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
              justifyItems: "center",
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
              <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} gap={"1.5rem"}>
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
                  maxWidth={"40ch"}
                  sx={{
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                    fontSize: {
                      xs: "16px",
                      md: "20px",
                    },
                  }}
                  variant="body2"
                  component={"p"}
                  color={grey["300"]}
                >
                  Simple and efficient crm application created using modern tools.
                </Typography>
                <Link href={"/auth"}>
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
              }}
            >
              <Image
                width={450}
                height={450}
                src="/tech-company-animate.svg"
                alt="person working on macbook"
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
