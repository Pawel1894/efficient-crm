import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRef, useState } from "react";
import {
  Add,
  Analytics,
  AttachMoney,
  Group,
  Home,
  LocalActivity,
  ModeStandby,
  Settings,
} from "@mui/icons-material";
import { Paper, useMediaQuery } from "@mui/material";
import { UserButton, useOrganization, useOrganizations, useUser } from "@clerk/nextjs";
import TeamSwitcher from "./TeamSwitcher";
import CenterLoad from "./CenterLoad";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSystemStore } from "@/pages/_app";

import { grey } from "@mui/material/colors";
import CreateOrganization from "./CreateOrganization";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
  desktopbr: boolean;
}>(({ theme, open, desktopbr }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    desktopbr && {
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  desktopbr: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, desktopbr }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    desktopbr && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  const desktopbr = useMediaQuery("(min-width:900px)");

  const breadcrumbs = useSystemStore((state) => state.breadcrumbs);
  const [open, setOpen] = useState(true);
  const { isLoaded } = useOrganization();
  const { isLoaded: orgsLoad } = useOrganizations();
  const { isLoaded: userLoad, isSignedIn } = useUser();
  const { pathname } = useRouter();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  if (!isLoaded && !orgsLoad && !userLoad) {
    return <CenterLoad />;
  }

  return (
    <>
      <AppBar position="fixed" open={open} desktopbr={desktopbr}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {desktopbr && breadcrumbs}
          <Box ml={"auto"} display="flex" alignItems={"center"} gap="1rem">
            <TeamSwitcher />
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerComponent open={open} setOpen={setOpen} />
      <Main open={open} desktopbr={desktopbr}>
        <DrawerHeader />
        {!desktopbr && (
          <Box pb={3}>
            <Paper sx={{ padding: "0.5rem", overflow: "hidden" }}>{breadcrumbs}</Paper>
          </Box>
        )}

        {children}
      </Main>
    </>
  );
}

function DrawerComponent({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <aside>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Navigation />
      </aside>
    </Drawer>
  );
}

function Navigation() {
  const router = useRouter();
  const { organization, membership } = useOrganization();
  const [orgOpen, setOrgOpen] = useState(false);
  const orgRef = useRef<HTMLLIElement>(null);

  return (
    <>
      <CreateOrganization open={orgOpen} setOpen={setOrgOpen} itemRef={orgRef} />
      <nav>
        {organization ? (
          <>
            <List>
              {commonMenu.map((item) => {
                return (
                  <Link key={item.id} style={{ textDecoration: "unset" }} href={item.link}>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{
                          backgroundColor: router.pathname.startsWith(item.basePath) ? grey["800"] : "",
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText sx={{ color: "#fff" }} primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                );
              })}

              <Link style={{ textDecoration: "unset" }} href={"/dictionary"}>
                <ListItem key={"Dictionary"} disablePadding>
                  <ListItemButton
                    sx={{
                      backgroundColor: router.pathname.startsWith("/dictionary") ? grey["800"] : "",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText sx={{ color: "#fff" }} primary="Dictionary" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </List>
            <Divider />
          </>
        ) : null}
        <List>
          <ListItem ref={orgRef} disablePadding>
            <ListItemButton onClick={() => setOrgOpen((prev) => !prev)}>
              <ListItemIcon sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
                <Add />
              </ListItemIcon>
              <ListItemText sx={{ color: "#fff" }} primary={"Create new team"} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </>
  );
}

type MenuItem = {
  id: number;
  text: string;
  link: string;
  icon: JSX.Element;
  basePath: string;
};

const commonMenu: Array<MenuItem> = [
  {
    id: 0,
    text: "Home",
    link: "/home",
    icon: <Home />,
    basePath: "/home",
  },
  {
    id: 2,
    text: "Leads",
    link: "/lead",
    icon: <ModeStandby />,
    basePath: "/lead",
  },
  {
    id: 3,
    text: "Deals",
    link: "/deal",
    icon: <AttachMoney />,
    basePath: "/deal",
  },
  {
    id: 4,
    text: "Activities",
    link: "/activity",
    icon: <LocalActivity />,
    basePath: "/activity",
  },
  {
    id: 6,
    text: "Analytics",
    link: "/analytics",
    icon: <Analytics />,
    basePath: "/analytics",
  },
  {
    id: 5,
    text: "Team",
    link: "/team",
    icon: <Group />,
    basePath: "/team",
  },
];
