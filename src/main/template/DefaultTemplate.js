import React from "react"
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import PublicIcon from '@mui/icons-material/Public';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, ListItemText } from "@mui/material";

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Our Code
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const DefaultTemplate = ({ children: Element }) => {

	return (<ThemeProvider theme={defaultTheme}>
		<CssBaseline />
		<AppBar position="relative">
			<Toolbar>
				<PublicIcon sx={{ mr: 2 }} />
				<Typography variant="h6" color="inherit" noWrap>
					JeliMaps
				</Typography>
			</Toolbar>
		</AppBar>
		{Element}
		{/* Footer */}
		<Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
			<Typography variant="h6" align="center" gutterBottom>
				Footer
			</Typography>
			<Typography
				variant="subtitle1"
				align="center"
				color="text.secondary"
				component="p"
			>
				Something here to give the footer a purpose!
			</Typography>
			<Copyright />
		</Box>
		{/* End footer */}
	</ThemeProvider>)
}

export const blabla = ""

export default DefaultTemplate