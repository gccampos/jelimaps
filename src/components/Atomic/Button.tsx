import { Button, ButtonProps } from "@mui/material";

const ButtonJeli = (props: ButtonProps) => {
  return (
    <Button variant="contained" size="small" sx={{ my: 1, mr: 1 }} {...props}>
      {props.children}
    </Button>
  );
};

export default ButtonJeli;
