import "./globals.css";
import { Afacad } from 'next/font/google';

const myFont = Afacad({
  subsets: ['latin'],
  variable: '--my-font',
})

export const metadata = {
  title: "QR Creator",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body className="bg-slate-700 leading-loose text-zinc-400 antialiased selection:bg-slate-400 selection:text-slate-900">{children}</body>
    </html>
  );
}
