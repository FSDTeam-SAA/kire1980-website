import Provider from "@/Providers/Provider";
import Navbar from "@/components/sheared/Navbar";
import Footer from "@/components/sheared/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Provider> {children} </Provider>
      <Footer />
    </>
  );
}
