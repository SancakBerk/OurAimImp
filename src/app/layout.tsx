import { Metadata } from "next";
import "./globals.css";
import { Providers } from "../redux/reduxProvider";
import dotenv from "dotenv";

export const metadata: Metadata = {
  title: "Hey YOU <3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  dotenv.config();
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
