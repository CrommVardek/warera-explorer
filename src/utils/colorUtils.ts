import { color, type HSLColor, type RGBColor } from "d3";

// Function to determine if a color is light or dark (based on YIQ luminance)
const getBrightness = (hexcolor: string): boolean => {
  // or pass a d3 color object's rgb components
  var r = parseInt(hexcolor.substring(1, 3), 16);
  var g = parseInt(hexcolor.substring(3, 5), 16);
  var b = parseInt(hexcolor.substring(5, 7), 16);
  // YIQ formula for perceived luminance
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Return true for light background, false for dark background
  return yiq >= 64; // 128 is a common threshold for switching between black and white text
};

// Function to adjust a foreground color based on background brightness
export const adjustColorForBackground = (
  backgroundColor: RGBColor | HSLColor
): string | undefined => {
  let isBackgroundLight = getBrightness(backgroundColor.formatHex());

  if (isBackgroundLight) {
    return "#000"; // k parameter controls intensity
  } else {
    // If the background is dark, the foreground color should be brighter
    // Use color.brighter()
    return "#BBB"; // k parameter controls intensity
  }
};

export const warEraColorToHex = (warEraColor: string): string => {
  switch (warEraColor) {
    case "yellow":
      return "#FFFF00";
    case "red":
      return "#FF0000";
    case "blue":
      return "#0066ffff";
    case "lightBlue":
      return "#ADD8E6";
    case "lightGreen":
      return "#90EE90";
    case "amber":
      return "#FFBF00";
    case "orange":
      return "#FFA500";
    case "pink":
      return "#FFC0CB";
    case "lime":
      return "#00FF00";
    case "gray":
      return "#808080";
    case "teal":
      return "#008080";
    case "green":
      return "#008000";
    case "purple":
      return "#920092ff";
    case "lightOrange":
      return "#FFA726";
    case "brown":
      return "#A52A2A";
    case "indigo":
      return "#7100c2ff";
    case "cyan":
      return "#00FFFF";
    case "deepPink":
      return "#FF1493";
    case "deepOrange":
      return "#FF8C00";
    case "olive":
      return "#808000";
    default:
      return warEraColor;
  }
};
