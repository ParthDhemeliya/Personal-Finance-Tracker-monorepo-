import { Inter } from "next/font/google";
import { Providers } from "../redux/provider";
import "./globals.css";
// import UserBootstrap from "../common/UserBootstrap";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Personal Finance Tracker</title>
        <meta
          name="description"
          content="Track your income, expenses, and savings goals with the Personal Finance Tracker app."
        />
      </Head>
      <body className={inter.className}>
        <Providers>
          {/* <UserBootstrap /> */}
          {children}

          <SpeedInsights />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
                zIndex: 9999,
              },
              success: {
                duration: 3000,
                style: {
                  background: "#10B981",
                  zIndex: 9999,
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#EF4444",
                  zIndex: 9999,
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
