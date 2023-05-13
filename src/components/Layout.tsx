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
import { UserButton, useUser } from "@clerk/nextjs";

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
  const [open, setOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: teams } = api.user.myTeams.useQuery();
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          {isSignedIn && (
            <Box ml={"auto"} display="flex" alignItems={"center"} gap="1rem">
              {/* {teams?.team?.length ? (
                <FormControl fullWidth>
                  <InputLabel>Current Team</InputLabel>
                  <Select sx={{ height: "2.3rem" }} fullWidth value={10} label="Current Team">
                    {teams?.team.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null} */}
              <UserButton />
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

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
          <nav>
            <List>
              {commonMenu.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton href={item.link}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
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
        </aside>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </>
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
  {
    id: 5,
    text: "Dictionary",
    link: "/setting/dictionary",
    icon: <Settings />,
  },
];
