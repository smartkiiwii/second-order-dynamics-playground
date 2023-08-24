const extendingProps = {
  sizes: {
    width: {
      "device-screen": "100dvw",
    },
    height: {
      "device-screen": "100dvh",
    },
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        ...extendingProps.sizes.width,
      },
      minWidth: {
        ...extendingProps.sizes.width,
      },
      maxWidth: {
        ...extendingProps.sizes.width,
      },
      height: {
        ...extendingProps.sizes.height,
      },
      minHeight: {
        ...extendingProps.sizes.height,
      },
      maxHeight: {
        ...extendingProps.sizes.height,
      },
    },
  },
  plugins: [],
};
