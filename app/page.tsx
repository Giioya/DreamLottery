"use client";

import { useContext, useRef, useState, useEffect } from "react";
import Idiomas from "@/components/Idiomas";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { getLotteryContract } from "@/app/utils/ethersHelpers";
import { MiniKit } from "@worldcoin/minikit-js"; // 👈 Importante
import { useRouter } from "next/navigation"; // Opcional, por si quieres redirigir después de login

export default function Home() {
  const { language } = useContext(LanguageContext) as { language: keyof typeof messages };
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgImage, setBgImage] = useState(`/images/rare.jpg`);
  const [fade, setFade] = useState(false);
  const isScrolling = useRef(false);
  const [loteriasActivas, setLoteriasActivas] = useState<Record<string, { vendidos: number; total: number }>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(true); // 👈 Estado de carga durante auth
  const router = useRouter();

  const lotteries = [
    { key: "quartz", link: "/lottery/quartz", price: "0.5 WLD", mainBg: "bg_main_quartz.jpg", button: "bg-[#f3ffca]", border: "border-green-600", color: "text-green-600", bgColor: "bg-white/70", prize: "40 WLD" },
    { key: "citrine", link: "/lottery/citrine", price: "1 WLD", mainBg: "epic.jpg", button: "bg-[#ffefbd]", border: "border-[#ff6c01]", color: "text-[#ff6c01]", bgColor: "bg-white/70", prize: "80 WLD" },
    { key: "amethyst", link: "/lottery/amethyst", price: "3 WLD", mainBg: "legendary.jpg", button: "bg-[#f7ecff]", border: "border-[#903eca]", color: "text-[#903eca]", bgColor: "bg-white/70", prize: "240 WLD" },
    { key: "saphire", link: "/lottery/saphire", price: "5 WLD", mainBg: "mythic.jpg", button: "bg-[#d5f0ff]", border: "border-[#3554f7]", color: "text-[#3554f7]", bgColor: "bg-white/70", prize: "400 WLD" },
    { key: "diamond", link: "/lottery/diamond", price: "10 WLD", mainBg: "divine.jpg", button: "bg-[#fff5fb]", border: "border-[#4b002a]", color: "text-[#4b002a]", bgColor: "bg-white/70", prize: "800 WLD" },
  ];

  useEffect(() => {
    const authenticate = async () => {
      if (!MiniKit.isInstalled()) {
        console.error("Worldcoin MiniKit not installed");
        return;
      }

      try {
        const res = await fetch(`/api/nonce`);
        const { nonce } = await res.json();

        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
          nonce: nonce,
          requestId: '0',
          expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          statement: 'Sign in to Dream Lottery',
        });

        if (finalPayload.status === 'error') {
          console.error("WalletAuth failed");
          return;
        }

        const response = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: finalPayload, nonce }),
        });

        const result = await response.json();

        if (result.status !== 'success' || !result.isValid) {
          console.error("SIWE verification failed");
          return;
        }

        console.log("User authenticated:", MiniKit.walletAddress);
        // Opcional: puedes guardar el wallet en tu estado global o cookies aquí
      } catch (error) {
        console.error("Error during wallet authentication:", error);
      } finally {
        setIsAuthenticating(false); // 👈 Ya terminó la auth
      }
    };

    authenticate();
  }, []);

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
  }, []);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">
        Iniciando sesión...
      </div>
    );
  }

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
        <img
          src="/images/main_title.png"
          alt="Título de la Lotería"
          className="w-96 h-40"
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
    </main>
  );
}