const _colors = {
  black: "#20262E",
  white: "#E9E8E8",
  grey_200: "#31343A",
  grey_100: "#63666A",
  pink_300: "#CD5888",
  pink_200: "#DA87A9",
  pink_100: "#F3C9DA",
  purple_300: "#913175",
  purple_200: "#BB69A3",
};

const _text = {
  h1: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
  h2: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
  },
  h3: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  h4: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
  },
  buttonLabelLg: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  buttonLabelSm: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
  },
};

const _icons = {
  lg: {
    height: 25,
    resizeMode: "contain",
  },
  md: {
    height: 20,
    resizeMode: "contain",
  },
  sm: {
    height: 17,
    resizeMode: "contain",
  },
  xs: {
    height: 11,
    resizeMode: "contain",
  },
};

const GlobalStyles = {
  colors: _colors,
  text: _text,
  icons: _icons,
  //   windowW: WINDOW_WIDTH,
  //   windowH: WINDOW_HEIGHT,
};

export default GlobalStyles;
