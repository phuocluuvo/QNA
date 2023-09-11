import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Fragment } from "react";
import Header from "../Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Header />
      <body className={inter.className}>{children}</body>
    </Fragment>
  );
}
