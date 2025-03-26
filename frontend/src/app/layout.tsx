/* eslint-disable @next/next/no-html-link-for-pages */
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Product Delivery Status Tracker",
  description: "Track FedEx and DHL shipments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="p-4 bg-gray-800 text-white">
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Dashboard</a></li>
            <li><a href="/shipments" className="hover:underline">Shipments</a></li>
            <li><a href="/shipments/create" className="hover:underline">Create Shipment</a></li>
          </ul>
        </nav>
        <main className="p-6">{children}</main>
        {/* Add toast */}
        <Toaster />
      </body>
    </html>
  );
}