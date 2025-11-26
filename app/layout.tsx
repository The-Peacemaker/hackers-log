import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClickSpark from "@/components/ClickSpark";

export const metadata: Metadata = {
  title: "root@benedict:~",
  description: "Benedii's Hacker Blog & Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-mono">
        <ThemeProvider>
          <ClickSpark
            sparkColor='#00ff41'
            sparkSize={10}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
          >
            {children}
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
