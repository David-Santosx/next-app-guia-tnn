import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NavigationLinks = [
  {
    title: "Nossa Cidade",
    href: "/",
    itens: [
      {
        title: "História",
        href: "/historia",
      },
      {
        title: "Comunidades",
        href: "/comunidades",
      },
    ],
  },
  {
    title: "Fotos",
    href: "/fotos",
  },
  {
    title: "Comércios",
    href: "/comercios",
  },
  {
    title: "Eventos",
    href: "/eventos",
  },
];

function WeatherWidget() {
  return <div className="w-full bg-brand-primary h-6 flex items-center"></div>;
}

function HeaderNavgation() {
  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-5">
        {NavigationLinks.map((link, index) => (
          <li key={index}>
            {link.itens ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-brand-secondary hover:bg-brand-secondary hover:brightness-150 hover:scale-105 rounded-3xl cursor-pointer">
                    {link.title}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 bg-white border border-brand-primary/20 rounded-lg shadow-lg p-1"
                >
                  {link.itens.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      asChild
                      className="rounded-md hover:bg-brand-secondary/10 focus:bg-brand-secondary/10 focus:text-foreground"
                    >
                      <Link
                        href={item.href}
                        className="w-full cursor-pointer py-2 px-3 text-sm font-medium"
                      >
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={link.href}>
                <Button
                  variant={"ghost"}
                  className="hover:bg-brand-secondary/10 cursor-pointer"
                >
                  {link.title}
                </Button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10 hover:text-brand-secondary"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-l-brand-primary bg-white p-0"
      >
        <div className="border-b-brand-primary border-2 py-3 px-4 mb-6">
          <Image
            src={"/brand/app-logo-horizontal.svg"}
            className="w-[180px]"
            width={100}
            height={50}
            alt="Guia TNN"
          />
        </div>
        <nav className="flex flex-col px-4">
          {NavigationLinks.map((link, index) => (
            <div key={index} className="py-3 border-b border-gray-100">
              {link.itens ? (
                <>
                  <Link
                    href={link.href}
                    className="text-lg font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    {link.title}
                  </Link>
                  <div className="mt-2 pl-4 flex flex-col gap-2">
                    {link.itens.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="text-sm py-1 text-gray-700 hover:text-brand-secondary transition-colors font-medium"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="text-lg font-medium text-brand-primary hover:text-brand-secondary transition-colors block py-1"
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function Header() {
  return (
    <div className="w-full px-2.5 h-34 flex items-center justify-between">
      <Link href={"/"}>
        <Image
          src={"/brand/app-logo-horizontal.svg"}
          className="w-[180px] md:w-[250px]"
          width={100}
          height={100}
          alt="Guia TNN"
        />
      </Link>
      <div className="flex items-center">
        <HeaderNavgation />
        <MobileNavigation />
      </div>
    </div>
  );
}

export default function AppHeader() {
  return (
    <>
      <header className="flex flex-col space-y-3">
        <WeatherWidget />
        <Header />
      </header>
      <Separator />
    </>
  );
}
