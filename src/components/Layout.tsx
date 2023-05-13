import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
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
import { useState } from "react";
import {
  AccountCircle,
  Add,
  AttachMoney,
  ContactPage,
  Group,
  LocalActivity,
  ModeStandby,
  Settings,
} from "@mui/icons-material";
import { FormControl, InputLabel, Link, Menu, MenuItem, Select } from "@mui/material";
import { api } from "@/utils/api";
import { UserButton, useOrganization, useOrganizations, useUser } from "@clerk/nextjs";
import TeamSwitcher from "./TeamSwitcher";
import CenterLoad from "./CenterLoad";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
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
  breadcrumbs: JSX.Element;
};

export default function Layout({ children, breadcrumbs }: Props) {
  const [open, setOpen] = useState(true);
  const { isLoaded } = useOrganization();
  const { isLoaded: orgsLoad } = useOrganizations();
  const { isLoaded: userLoad } = useUser();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  if (!isLoaded && !orgsLoad && !userLoad) {
    return <CenterLoad />;
  }

  return (
    <>
      <AppBar position="fixed" open={open}>
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
          {breadcrumbs}
          <Box ml={"auto"} display="flex" alignItems={"center"} gap="1rem">
            <TeamSwitcher />
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerComponent open={open} setOpen={setOpen} />
      <Main open={open}>
        <DrawerHeader />
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
        width: drawerWidth,
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
  const { organization, membership } = useOrganization();

  return (
    <nav>
      {organization ? (
        <>
          <List>
            {commonMenu.map((item) => {
              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton href={item.link}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {membership?.role === "admin" ? (
              <ListItem key={"dictionary"} disablePadding>
                <ListItemButton href={"/admin/dictionary"}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Dictionary" />
                </ListItemButton>
              </ListItem>
            ) : null}
          </List>
          <Divider />
        </>
      ) : null}
      <List>
        <ListItem disablePadding>
          <ListItemButton href={"/setting/create-team"}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary={"Create new team"} />
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
}

type MenuItem = {
  id: number;
  text: string;
  link: string;
  icon: JSX.Element;
};

const commonMenu: Array<MenuItem> = [
  {
    id: 0,
    text: "Contacts",
    link: "/contact",
    icon: <ContactPage />,
  },
  {
    id: 1,
    text: "Leads",
    link: "/lead",
    icon: <ModeStandby />,
  },
  {
    id: 2,
    text: "Deals",
    link: "/deal",
    icon: <AttachMoney />,
  },
  {
    id: 3,
    text: "Activities",
    link: "/activity",
    icon: <LocalActivity />,
  },
  {
    id: 4,
    text: "Team",
    link: "/team",
    icon: <Group />,
  },
];
