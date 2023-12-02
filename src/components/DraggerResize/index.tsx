import { styled } from "@mui/material";

const Dragger = styled("div")`
  cursor: resize;
  height: 100%;
`;
const DraggerResize = ({
  children,
  id,
  sx,
}: {
  id?: any;
  children?: any;
  sx?: any;
}) => {
  return (
    <Dragger
      id={id ?? "seletorResize"}
      onTouchStart={(e) => {
        (e.target as any).classList.add("borda-seletora-ativa");
      }}
      onTouchEnd={(e) => {
        (e.target as any).classList.remove("borda-seletora-ativa");
      }}
      sx={sx}
    >
      {children}
    </Dragger>
  );
};

export default DraggerResize;
