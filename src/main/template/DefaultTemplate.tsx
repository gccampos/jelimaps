import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "../partial/ResponsiveAppBar";

function Copyleft() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyleft © "}
      <Link color="inherit" href="https://github.com/gccampos/jelimaps">
        Nosso código
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const DefaultTemplate = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ResponsiveAppBar />

      {children}
      {/* Footer */}
      <div className="footer">
        <Box sx={{ bgcolor: "lightgray", p: 2 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            JeliMaps
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Danilo e Guilherme
          </Typography>
          <Copyleft />
        </Box>
        {/* End footer */}
      </div>
    </ThemeProvider>
  );
};

export const blabla = "";

export default DefaultTemplate;
