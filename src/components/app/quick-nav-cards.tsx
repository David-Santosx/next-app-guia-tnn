"use client";

import Link from "next/link";
import { Store, Calendar, Image as ImageIcon } from "lucide-react";

interface QuickNavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

function QuickNavCard({ title, description, icon, href, color, bgColor }: QuickNavCardProps) {
  return (
    <Link href={href} className="block w-full">
      <div 
        className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full border border-border`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`${color} mb-4`}>
            {icon}
          </div>
          <h3 className="text-card-foreground text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function QuickNavCards() {
  const navItems = [
    {
      title: "Comércios Locais",
      description: "Descubra os melhores estabelecimentos comerciais da nossa cidade",
      icon: <Store className="h-10 w-10" />,
      href: "/comercios",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Eventos",
      description: "Fique por dentro dos próximos eventos e atividades culturais",
      icon: <Calendar className="h-10 w-10" />,
      href: "/eventos",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Galeria de Fotos",
      description: "Explore imagens e momentos especiais da nossa comunidade",
      icon: <ImageIcon className="h-10 w-10" />,
      href: "/fotos",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Explore Nossa Cidade</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navItems.map((item, index) => (
          <QuickNavCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
            color={item.color}
            bgColor={item.bgColor}
          />
        ))}
      </div>
    </div>
  );
}