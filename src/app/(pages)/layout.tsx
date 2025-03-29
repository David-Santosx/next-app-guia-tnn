import AppHeader from "../components/Header";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="px-4 sm:px-6 md:px-8 lg:px-14 xl:px-16 mx-auto max-w-screen-4xl">
        {children}
      </div>
    </>
  );
}
