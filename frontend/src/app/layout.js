// app/layout.js

// Import the components we just created
 import Header from "@/components/layout/Header"; // Updated path
 import Footer from "@/components/layout/Footer"; // Updated path

// Make sure your global CSS is imported here
import "./globals.css";


// This metadata will set the default title for your app
export const metadata = {
  title: "Thumbworx Logistics",
  description: "Logistics and Vehicle Management Dashboard",
};


export default function RootLayout({ children }) {
  return (
    // Add the suppressHydrationWarning prop here
    <html lang="en" suppressHydrationWarning={true}>
      <body className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
          <Footer />
      </body>
    </html>
  );
}