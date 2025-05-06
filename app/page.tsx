"use client";

import { useContext, useRef, useState, useEffect } from "react";
import Idiomas from "@/components/Idiomas";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { getLotteryContract } from "@/app/utils/viemHelpers";
import { getBalance } from "@/components/balance";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWallet } from "@/context/WalletAuthContext";

export default function Home() {
  const { language } = useContext(LanguageContext) as { language: keyof typeof messages };
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgImage, setBgImage] = useState("");
  const [fade, setFade] = useState(false);
  const isScrolling = useRef(false);
  const [loteriasActivas, setLoteriasActivas] = useState<
    Record<string, { vendidos: number; total: number }>
  >({});
  const { username, walletAddress } = useWallet();
  const [saldo, setSaldo] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);


  const lotteries = [
    {
      key: "stone",
      link: "/lottery/stone",
      price: "0.25 WLD",
      mainBg: "rock.jpg",
      button: "bg-[#c57d56]",
      border: "border-[#6c3b2a]",
      color: "text-[#6c3b2a]",
      bgColor: "bg-white/70",
      prize: "20 WLD",
    },
    {
      key: "quartz",
      link: "/lottery/quartz",
      price: "0.5 WLD",
      mainBg: "quartz.jpg",
      button: "bg-[#f3ffca]",
      border: "border-green-600",
      color: "text-green-600",
      bgColor: "bg-white/70",
      prize: "40 WLD",
    },
    {
      key: "citrine",
      link: "/lottery/citrine",
      price: "1 WLD",
      mainBg: "citrine.jpg",
      button: "bg-[#ffefbd]",
      border: "border-[#ff6c01]",
      color: "text-[#ff6c01]",
      bgColor: "bg-white/70",
      prize: "80 WLD",
    },
    {
      key: "amethyst",
      link: "/lottery/amethyst",
      price: "3 WLD",
      mainBg: "amethyst.jpg",
      button: "bg-[#f7ecff]",
      border: "border-[#903eca]",
      color: "text-[#903eca]",
      bgColor: "bg-white/70",
      prize: "240 WLD",
    },
    {
      key: "sapphire",
      link: "/lottery/sapphire",
      price: "5 WLD",
      mainBg: "sapphire.jpg",
      button: "bg-[#d5f0ff]",
      border: "border-[#3554f7]",
      color: "text-[#3554f7]",
      bgColor: "bg-white/70",
      prize: "400 WLD",
    },
    {
      key: "diamond",
      link: "/lottery/diamond",
      price: "10 WLD",
      mainBg: "diamond.jpg",
      button: "bg-[#fff5fb]",
      border: "border-[#4b002a]",
      color: "text-[#4b002a]",
      bgColor: "bg-white/70",
      prize: "800 WLD",
    },
  ];

  type LoteriaActiva = {
    id: bigint;
    nombre: string;
    boletosVendidos: number;
    totalBoletos: number;
    cerrada: boolean;
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    const storedUser = localStorage.getItem("username");
  
    if (storedWallet && storedUser) {
      setStoredUsername(storedUser);
      console.log("Datos cargados desde localStorage:", storedWallet, storedUser);
    }
  }, []);
  
  

  // Actualiza el fondo dinámicamente en base a la lotería actual
  useEffect(() => {
    setFade(true);
    setTimeout(() => {
      setBgImage(`/images/${lotteries[currentIndex].mainBg}`);
      setFade(false);
    }, 300);
  }, [currentIndex]);

  // Mueve el carrusel a un índice específico
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

  // Dentro del useEffect que obtiene las loterías activas
  useEffect(() => {
    const fetchActivas = async () => {
      try {
        const contract = getLotteryContract();
        console.log("Obteniendo contrato...");
  
        // Obtenemos las loterías activas desde el contrato
        const result = await contract.read.verLoteriasActivas() as {
          id: string;
          nombre: string;
          boletosVendidos: string;
          totalBoletos: string;
          cerrada: boolean;
        }[];
  
        console.log("Loterías activas desde el contrato:", result);
  
        // Procesamos el resultado
        const parsed = result.reduce((acc: any, l) => {
          const nombreNormalizado = l.nombre.toLowerCase();
          const vendidos = Number(l.boletosVendidos);
          const total = Number(l.totalBoletos);
  
          console.log(`Procesando lotería: ${l.nombre}`);
          console.log(`Vendidos: ${vendidos}, Total: ${total}`);
  
          acc[nombreNormalizado] = {
            vendidos,
            total,
          };
          return acc;
        }, {});
  
        console.log("Estado final loteriasActivas:", parsed);
        setLoteriasActivas(parsed);
      } catch (error) {
        console.error("Error al obtener boletos vendidos:", error);
      }
    };
  
    fetchActivas();
  }, []);
  

  // Si existe walletAddress en el contexto, obtenemos el balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (walletAddress) {
        try {
          const balance = await getBalance(walletAddress);
          setSaldo(balance.toFixed(2));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchUserBalance();
  }, [walletAddress]);

  // Función para borrar cookies relacionadas a la autenticación y refrescar la página
  const clearAuthCache = () => {
    // Borra las cookies importantes
    document.cookie = "wallet-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "wallet-address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "siwe=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Recargar la página para forzar la redirección a login si no hay autenticación
    window.location.reload();
  };

  const currentLottery = lotteries[currentIndex];

  return (
    <ProtectedRoute>
      <main {...handlers} className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Fondo dinámico */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
  
        {/* Selector de idioma */}
        <Idiomas />
  
        {/* Imagen de título centrada */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-full">
          <img
            src="/images/lottery_title3.png"
            alt="Título de la Lotería"
            className="w-[60rem] h-[13rem] object-fill"
          />
        </div>
  
        {/* Carrusel de Loterías */}
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden mt-6">
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
                  <p className="text-xl font-semibold mt-2 text-black underline">
                    {messages[language].price} {lottery.price}
                  </p>
                  <p className="text-black text-xl font-bold underline">
                    {messages[language].prize} {lottery.prize}
                  </p>
                  <Link href={lottery.link}>
                    <button className={`mt-6 ${lottery.button} text-black px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-gray-300 transition`}>
                      {messages[language].buy_ticket}
                    </button>
                  </Link>
                  <p className="mt-6 text-black text-lg">{`${vendidos} / ${total} ${messages[language].Purchased_tickets}`}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {(
          <div
            className={`absolute bottom-10 left-2 mb-16 z-10 px-6 py-2 rounded-3xl shadow-lg border-4 ${currentLottery.border} ${currentLottery.bgColor}`}
          >
            <p className={`text-sm font-bold ${currentLottery.color}`}>
              {messages[language].welcome} {storedUsername}
            </p>
            <p className={`text-xs font-semibold ${currentLottery.color}`}>
            {messages[language].balance}: {saldo} WLD
            </p>
          </div>
        )}

      </main>
  
      {/* Botón para borrar cache/cookies, posicionado con margen inferior para evitar taparlo con el footer */}
      {/*<button
        onClick={clearAuthCache}
        className="fixed bottom-20 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700 transition"
      >
        Limpiar autenticación
      </button>*/}
    </ProtectedRoute>
  );    
}