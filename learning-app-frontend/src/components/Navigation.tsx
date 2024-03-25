import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  TextField,
  IconButton,
  Popover,
  Paper,
  MenuList,
  MenuItem,
  ListItemText,
} from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import Person2Icon from "@mui/icons-material/Person2";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";

type NavigationProps = {
  title?: string;
};
const Navigation = ({ title = "Learning App" }: NavigationProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { authUser } = useAuth();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handlePomodoroClick = () => {
    navigate("/pomodoro");
  };

  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleSubjectCreation = () => {
    navigate("/createsubject");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = async () => {
    await logOut();
  };
  const handleProfile = () => {
    navigate(`/${authUser?.displayName}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return authUser !== null ? (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Avatar onClick={() => navigate("/dashboard")}>
            <LocalLibraryIcon />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            {title}
          </Typography>
          <TextField
            id="input-with-icon-textfield"
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            variant="standard"
            size="small"
          />
          <Button onClick={handlePomodoroClick}>
            <Avatar
              variant="square"
              sx={{ borderRadius: 1, backgroundColor: "white" }}
            >
              <AvTimerIcon sx={{ color: "purple" }} />
            </Avatar>
          </Button>
          <Button onClick={handleProfileClick}>
            <Avatar sx={{ backgroundColor: "white" }}>
              <Person2Icon sx={{ color: "purple" }} />
            </Avatar>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Paper sx={{ width: 400, maxWidth: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  paddingTop: "2px",
                  paddingLeft: "2px",
                  alignItems: "center",
                }}
              >
                <Avatar>
                  <Person2Icon />
                </Avatar>
                <Typography sx={{ paddingLeft: "2px" }}>
                  {authUser?.displayName?.toUpperCase()}
                </Typography>
              </Box>
              <MenuList>
                <MenuItem onClick={handleProfile}>
                  <ListItemText>Your profile</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>Your notes</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSubjectCreation}>
                  <ListItemText>Create subject</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>Your recall list</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          </Popover>
        </Toolbar>
      </AppBar>
    </Box>
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Avatar>
            <LocalLibraryIcon />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            {title}
          </Typography>
          <Button color="inherit">
            <Link to="/login">Log In</Link>
          </Button>
          <Button color="inherit">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navigation;
