import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { IconButton, Typography, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Public } from "@mui/icons-material";
import { useRouter } from "next/router";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";

const pages = [
  { text: "Home", href: "/" },
  { text: "Sobre", href: "/about" },
  { text: "Studio", href: "/mapa" },
];

function ResponsiveAppBar() {
  const router = useRouter();
  const Logo = "JeliMaps";
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { openModalConfirm } = useCaixaDialogo();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleRouter = (path) => {
    path == "/mapa" && localStorage.getItem("mapaContext")
      ? openModalConfirm({
          title: "Você tem um projeto em andamento",
          message: "Deseja continuar ou começar do zero?",
          onConfirm: () => {
            router.push("/mapa?novo");
          },
          onCancel: () => {
            router.push("/mapa");
          },
          cancelarTitle: "Continuar um projeto",
          confirmarTitle: "Começar um novo",
        })
      : router.push(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Public sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => router.push("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {Logo}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  onClick={() => {
                    handleRouter(page.href);
                  }}
                >
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Public sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => router.push("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {Logo}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                onClick={() => handleRouter(page.href)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
