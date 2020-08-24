import "styled-components";
import { THEME } from "constants/styles";

type AVTheme = typeof THEME.landing;

declare module "styled-components" {
  export interface DefaultTheme extends AVTheme {}
}
