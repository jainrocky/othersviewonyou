import Footer from "@/components/footer";
import NavBar from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}