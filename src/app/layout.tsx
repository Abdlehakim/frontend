import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";


// Load the Google font
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${poppins.className}  !scroll-smooth font-sans`}>
      <body><GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>{children}</GoogleOAuthProvider></body>
    </html>
  );
};

export default RootLayout;
