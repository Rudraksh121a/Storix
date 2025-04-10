// src/constants/theme.ts

const Colors = {
    primary: "#007AFF",        // Vibrant Blue
    secondary: "#FF6F61",      // Coral Red
    background: "#F4F8FB",     // Soft Light Blue
    surface: "#FFFFFF",        // White for cards/containers
    textPrimary: "#2C3E50",    // Deep Navy
    textSecondary: "#757575",  // Medium Gray
    accent: "#FFC107",         // Golden Yellow
    error: "#FF3B30",          // Alert Red
    success: "#4CD964",        // Success Green
    border: "#E0E0E0",         // Light border
    shadow: "rgba(0,0,0,0.1)",
    dark: {
      background: "#121212",
      surface: "#1F1F1F",
      textPrimary: "#E0E0E0",
      textSecondary: "#9E9E9E",
    },
  };
  
  const Font = {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
    },
  };
  
  const Radius = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
  };
  
  const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };
  
  export const Theme = {
    Colors,
    Font,
    Radius,
    Spacing,
  };
  
  export default Theme;
  