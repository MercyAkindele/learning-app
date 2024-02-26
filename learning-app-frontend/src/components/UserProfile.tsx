import { useAuth } from "../firebase/auth";
import { Avatar, Box, Typography, Grid, Button, Paper } from "@mui/material";
// import { auth } from "../firebase/firebase";
import Navigation from "./Navigation";

const UserProfile = () => {
  const { authUser } = useAuth();
  return (
    <Box>
      <Navigation title={`${authUser?.displayName}`} />
      <Grid container>
        <Grid
          xs={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "black",
              width: "20vw",
              height: "20vw",
              marginTop: "4%",
            }}
          ></Avatar>
          <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
            {authUser?.displayName}
          </Typography>
          <Button variant="contained" sx={{ marginTop: 2 }}>
            Edit profile
          </Button>
        </Grid>
        <Grid xs={8}>
          <Typography sx={{ marginTop: "2%" }}>Pinned</Typography>
          <Grid container xs={10}>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>TypeScript Notes</Button>
              </Paper>
            </Grid>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>JavaScript Notes</Button>
              </Paper>
            </Grid>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>Java Notes</Button>
              </Paper>
            </Grid>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>C++ Notes</Button>
              </Paper>
            </Grid>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>C Notes</Button>
              </Paper>
            </Grid>
            <Grid xs={6}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  height: 80,
                  lineHeight: "80px",
                  justifyContent: "center",
                  marginTop: "4%",
                  alignItems: "center",
                  marginRight: "4%",
                }}
              >
                <Button>React.js Notes</Button>
              </Paper>
            </Grid>
            <Typography sx={{marginTop:"4%"}}>0 Contributions this year</Typography>
            <Grid container>
              <Grid xs={8} sx={{ marginTop: "2%" }}>
                <Paper elevation={2}>
                  <Typography variant="h3">Calander will be here</Typography>
                </Paper>
              </Grid>
              <Grid xs={2} sx={{marginLeft:"15%", textAlign:"center"}}>
                <Paper elevation={2}>
                    <Typography>Year</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
