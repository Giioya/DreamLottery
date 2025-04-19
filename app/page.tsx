"use client";

import { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/components/wallet/WalletAuthContext";
import Idiomas from "@/components/Idiomas";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { getLotteryContract } from "@/app/utils/ethersHelpers";
import Image from "next/image"; // Usamos el componente Image de Next.js

export default function Home() {
  const { isAuthenticated, walletAddress, loading } = useWalletAuth();  // Ahora obtenemos walletAddress
  const router = useRouter();
  const { language } = useContext(LanguageContext) as { language: keyof typeof messages };
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgImage, setBgImage] = useState(`/images/rare.jpg`);
  const [fade, setFade] = useState(false);
  const isScrolling = useRef(false);
  const [loteriasActivas, setLoteriasActivas] = useState<Record<string, { vendidos: number; total: number }>>({});
  const [saldoDisponible, setSaldoDisponible] = useState<string | null>(null);  // Estado para el saldo de la billetera

  // `useEffect` para redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else {
      // Si está autenticado, puedes obtener el saldo disponible de la billetera
      if (walletAddress) {
        getBalance(walletAddress).then((saldo) => {
          setSaldoDisponible(saldo); // Maneja el saldo en el estado
        });
      }
    }
  }, [loading, isAuthenticated, walletAddress, router]);

  // Cargar los detalles de las loterías activas
  useEffect(() => {
    const fetchActivas = async () => {
      try {
        const contract = await getLotteryContract();
        const result = await contract.verLoteriasActivas();

        const parsed = result.reduce((acc: any, l: any) => {
          acc[l.nombre.toLowerCase()] = {
            vendidos: Number(l.boletosVendidos),
            total: Number(l.totalBoletos),
          };
          return acc;
        }, {});        
        setLoteriasActivas(parsed);
      } catch (error) {
        console.error("Error al obtener boletos vendidos:", error);
      }
    };

    fetchActivas();
  }, []); // Se ejecuta una vez cuando el componente se monta

  const lotteries = [
    { key: "quartz", link: "/lottery/quartz", price: "0.5 WLD", mainBg: "bg_main_quartz.jpg", button: "bg-[#f3ffca]", border: "border-green-600", color: "text-green-600", bgColor: "bg-white/70", prize: "40 WLD" },
    { key: "citrine", link: "/lottery/citrine", price: "1 WLD", mainBg: "epic.jpg", button: "bg-[#ffefbd]", border: "border-[#ff6c01]", color: "text-[#ff6c01]", bgColor: "bg-white/70", prize: "80 WLD" },
    { key: "amethyst", link: "/lottery/amethyst", price: "3 WLD", mainBg: "legendary.jpg", button: "bg-[#f7ecff]", border: "border-[#903eca]", color: "text-[#903eca]", bgColor: "bg-white/70", prize: "240 WLD" },
    { key: "saphire", link: "/lottery/saphire", price: "5 WLD", mainBg: "mythic.jpg", button: "bg-[#d5f0ff]", border: "border-[#3554f7]", color: "text-[#3554f7]", bgColor: "bg-white/70", prize: "400 WLD" },
    { key: "diamond", link: "/lottery/diamond", price: "10 WLD", mainBg: "divine.jpg", button: "bg-[#fff5fb]", border: "border-[#4b002a]", color: "text-[#4b002a]", bgColor: "bg-white/70", prize: "800 WLD" },
  ];

  useEffect(() => {
    setFade(true);
    setTimeout(() => {
      setBgImage(`/images/${lotteries[currentIndex].mainBg}`);
      setFade(false);
    }, 300);
  }, [currentIndex]);

  const moveToIndex = (newIndex: number) => {
    if (isScrolling.current || !scrollRef.current) return;
    isScrolling.current = true;

    newIndex = Math.max(0, Math.min(newIndex, lotteries.length - 1));
    setCurrentIndex(newIndex);

    const container = scrollRef.current;
    const cardWidth = container.children[0].clientWidth;
    const gap = 20;
    const scrollPosition = newIndex * (cardWidth + gap);
    container.scrollTo({ left: scrollPosition, behavior: "smooth" });

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => moveToIndex(currentIndex + 1),
    onSwipedRight: () => moveToIndex(currentIndex - 1),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <main {...handlers} className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <Idiomas />

      {/* Imagen título centrada */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src="/images/main_title.png"
          alt="Título de la Lotería"
          width={384}
          height={160}
        />
      </div>

      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth w-full px-10 no-scrollbar snap-x snap-mandatory">
          {lotteries.map((lottery, index) => {
            const vendidos = loteriasActivas[lottery.key]?.vendidos ?? "—";
            const total = loteriasActivas[lottery.key]?.total ?? "—";

            return (
              <motion.div
                key={lottery.key}
                className={`min-w-[300px] min-h-[160px] max-w-sm ${lottery.bgColor} p-4 rounded-3xl shadow-xl flex flex-col items-center snap-center border-8 mb-28 ${lottery.border}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => moveToIndex(index)}
              >
                <h1 className={`text-3xl font-black mt-4 ${lottery.color} text-gradient text-center`}>
                  {messages[language][`lottery_${lottery.key}` as keyof typeof messages["en"]]}
                </h1>
                <p className="text-xl font-semibold mt-2 text-black underline">{messages[language].price} {lottery.price}</p>
                <p className="text-black text-xl font-bold underline">{messages[language].prize} {lottery.prize}</p>
                <Link href={lottery.link}>
                  <button className={`mt-6 ${lottery.button} text-black px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-gray-300 transition`}>
                    {messages[language].enter_draw}
                  </button>
                </Link>
                <p className="text-black mt-3 font-bold">{vendidos}/{total} {messages[language].Purchased_tickets}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mostrar información de billetera si está autenticado */}
      {isAuthenticated && walletAddress && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-white">
          <p>Billetera conectada: {walletAddress}</p>
          {saldoDisponible !== null && <p>Saldo disponible: {saldoDisponible} WLD</p>}
        </div>
      )}
    </main>
  );
}

async function getBalance(walletAddress: string) {
  const contract = await getLotteryContract();
  const balance = await contract.balanceOf(walletAddress);
  return balance.toString(); // Convierte el saldo a cadena
}