import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from './components/layout/Footer';
import StoreProvider from './lib/store/StoreProvider';
import ToastContainer from './components/ui/ToastContainer';
import AuthGuard from './components/auth/AuthGuard';
import { AuthProvider } from './components/auth/AuthProvider';
import CartSyncNotification from './components/cart/CartSyncNotification'; // ADD THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Merkato - Modern E-Commerce",
  description: "Your one-stop shop for everything",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <ToastContainer />
            <CartSyncNotification /> {/* ADD THIS */}
            <Header />
            <main className="flex-grow">
              <AuthGuard>
                {children}
              </AuthGuard>
            </main>
            <Footer />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}