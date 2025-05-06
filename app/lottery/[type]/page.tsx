"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { getLotteryContract } from "@/app/utils/viemHelpers";
import { ArrowLeft } from "lucide-react";
import BuyTicketsWithPermit2 from "@/components/BuyTickets";

const lotteryTypes = {
    stone: {color: "bg-[#d89a76]",size: "text-lg",selectColor: "bg-[#6c3b2a]",boColor: "border-[#6c3b2a]",textColor: "text-[#6c3b2a]",price: "0.25",prize: "20 WLD",bgColor: "bg-green-200",backgroundImage: "/images/bg_stone.png",titleImage: "/images/title_stone.png",},
    quartz: {color: "bg-[#f3ffca]",size: "text-lg",selectColor: "bg-green-400",boColor: "border-green-600",textColor: "text-green-600",price: "0.5",prize: "40 WLD",bgColor: "bg-green-200",backgroundImage: "/images/bg_quarzt.png",titleImage: "/images/title_quartz.png",},
    citrine: {color: "bg-[#ffefbd]",size: "text-lg",selectColor: "bg-[#ff6c01]",boColor: "border-[#ff6c01]",textColor: "text-black",price: "1",prize: "80 WLD",bgColor: "bg-yellow-200",backgroundImage: "/images/bg_citrine2.png",titleImage: "/images/title_citrine.png",},
    amethyst: {color: "bg-[#f7ecff]",size: "text-lg",selectColor: "bg-[#903eca]",boColor: "border-[#903eca]",textColor: "text-purple-600",price: "3",prize: "240 WLD",bgColor: "bg-purple-200",backgroundImage: "/images/bg_amethyst2.png",titleImage: "/images/title_amethyst.png",},
    sapphire: {color: "bg-[#d5f0ff]",size: "text-lg",selectColor: "bg-[#3554f7]",boColor: "border-[#3554f7]",textColor: "text-blue-600",price: "5",prize: "400 WLD",bgColor: "bg-blue-200",backgroundImage: "/images/bg_sapphire2.png",titleImage: "/images/title_sapphire.png",},
    diamond: {color: "bg-[#fff5fb]",size: "text-lg",selectColor: "bg-[#4b002a]",boColor: "border-[#4b002a]",textColor: "text-black drop-shadow-[0_0_5px_white]",price: "10",prize: "800 WLD",bgColor: "bg-gray-200",backgroundImage: "/images/bg_diamond2.png",titleImage: "/images/title_diamond.png",},
};

export default function LotteryPage({ params }: { params: { type: string } }) {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [purchasedNumbers, setPurchasedNumbers] = useState<number[]>([]);
    const [lotteryId, setLotteryId] = useState<number | null>(null);
    const [soldTickets, setSoldTickets] = useState<number>(0);

    const type = params.type as keyof typeof lotteryTypes;
    const lottery = lotteryTypes[type] || lotteryTypes.quartz;

    const numbers = Array.from({ length: 100 }, (_, i) => i);

    useEffect(() => {
        const fetchActiveLottery = async () => {
            try {
                const contract = await getLotteryContract();
                if (contract) {
                    const tipoFormateado = type.charAt(0).toUpperCase() + type.slice(1);   
                    const data = await contract.read.obtenerUltimaLoteriaActivaPorTipo([tipoFormateado]);   
                    const { id } = data as { id: bigint };
                    setLotteryId(Number(id));
                } else {
                    console.error("Contrato no disponible");
                }
            } catch (err) {
                console.error("Error al obtener la última lotería activa:", err);
            }
        };
    
        fetchActiveLottery();
    }, [type]);
    
    useEffect(() => {
        if (lotteryId === null) {
            return;
        }
    
        let intervalId: NodeJS.Timeout;
    
        const fetchPurchased = async () => {
            try {
                const contract = await getLotteryContract();
                const data = await contract.read.verCompradores([lotteryId]);
    
                if (Array.isArray(data) && data.every(item => typeof item === "string")) {
                    const buyers: string[] = data;
    
                    const purchased: number[] = buyers
                        .map((addr, idx) =>
                            addr !== "0x0000000000000000000000000000000000000000" ? idx : null
                        )
                        .filter((v) => v !== null) as number[];
    
                    setPurchasedNumbers(purchased);
                    setSoldTickets(purchased.length);
                } else {
                    console.error("Datos de compradores inválidos:", data);
                }
            } catch (err) {
                console.error("Error al obtener compradores:", err);
            }
        };
    
        fetchPurchased(); // Llamada inicial
        intervalId = setInterval(fetchPurchased, 1000); // Llamadas periódicas
    
        return () => clearInterval(intervalId); // Limpieza al desmontar o cambiar lotteryId
    }, [lotteryId]);    
    
    const toggleNumberSelection = (num: number) => {
        setSelectedNumbers((prev) => {
            const updated = prev.includes(num)
                ? prev.filter((n) => n !== num)
                : prev.length < 10
                    ? [...prev, num]
                    : prev;
            return updated;
        });
    };    

    const clearSelection = () => {
        setSelectedNumbers([]);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Fondo fijo */}
            <div
                className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${lottery.backgroundImage})` }}
            />

            <div className="relative z-10 w-full h-full overflow-y-auto pb-0 mb-0">
                {/* Flechita atrás funcional */}
                <div className="fixed top-6 left-4 z-20">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white"
                        style={{
                            WebkitTextStroke: "2px white",
                            color: "white",
                        }}
                    >
                        <ArrowLeft size={36} />
                    </button>
                </div>

                {/* Título visual atrás */}
                <div className="top-0 left-0 w-full z-0 pointer-events-none">
                    {lotteryId !== null && (
                        <div className="w-full max-w-sm h-36 mt-16 mx-auto flex justify-center items-center relative">
                            <img
                                src={lottery.titleImage}
                                alt="Fondo título"
                                className="absolute w-256 h-256 object-contain pt-60 mt-80"
                            />
                            <h1
                                className={`${lottery.size} font-bold pt-4 mt-40 z-10 text-center ${lottery.textColor}`}
                            >
                                ID #{lotteryId}.{" "}
                                {messages[language][`lottery_${type}` as keyof typeof messages["en"]]}
                            </h1>
                        </div>
                    )}

                    {/* Muestra el número de boletos vendidos */}
                    {lotteryId !== null && (
                        <div className="text-center text-xl mt-20">
                            <span className="font-bold text-black "
                            style={{
                                WebkitTextStroke: "1px black",
                                color: "black",
                            }}
                            aria-hidden="true"
                            >
                                {messages[language].Purchased_tickets}: {soldTickets} / 100
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col items-center mt-6">
                        {/* Precio */}
                        <div className="relative inline-block text-center">
                            <span
                                className="absolute inset-0 text-2xl font-black uppercase underline"
                                style={{
                                    WebkitTextStroke: "8px white",
                                    color: "transparent",
                                }}
                                aria-hidden="true"
                            >
                                {messages[language].price} ${lottery.price} WLD
                            </span>
                            <span className="relative text-2xl font-black uppercase underline">
                                {messages[language].price} ${lottery.price} WLD
                            </span>
                        </div>

                        {/* Premio */}
                        <div className="relative inline-block text-center">
                            <span
                                className="absolute inset-0 text-2xl font-black uppercase underline"
                                style={{
                                    WebkitTextStroke: "8px white",
                                    color: "transparent",
                                }}
                                aria-hidden="true"
                            >
                                {messages[language].prize} ${lottery.prize}
                            </span>
                            <span className="relative text-2xl font-black uppercase underline">
                                {messages[language].prize} ${lottery.prize}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contenido principal scrollable */}
                <div className="relative z-10 w-full h-full overflow-y-auto mt-10 px-6">
                    <div
                        className={`grid grid-cols-5 gap-2 p-4 ${lottery.boColor} ${lottery.color} shadow-md rounded-xl border-4 h-[300px] overflow-y-scroll`}
                    >
                        {numbers.map((num) => {
                            const isPurchased = purchasedNumbers.includes(num);
                            const isSelected = selectedNumbers.includes(num);
                            return (
                                <button
                                    key={num}
                                    disabled={isPurchased}
                                    onClick={() => toggleNumberSelection(num)}
                                    className={`w-12 h-12 flex items-center justify-center border rounded-xl text-lg font-bold
                                    ${isPurchased
                                        ? lottery.boColor
                                        : isSelected
                                            ? lottery.selectColor
                                            : "bg-white"
                                    }
                                    ${isPurchased ? "opacity-10 cursor-not-allowed" : ""}`}
                                >
                                    {num.toString().padStart(2, "0")}
                                </button>
                            );
                        })}
                    </div>

                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

                    <div className="flex flex-col items-center gap-4 mt-6">

                        <BuyTicketsWithPermit2
                            selectedNumbers={selectedNumbers}
                            className="bg-[#38b6ff] text-xl text-white px-6 py-2 disabled:bg-gray-400 rounded-xl w-64 max-w-xs"
                            type={type}
                            setErrorMessage={setErrorMessage}
                            lotteryId={lotteryId!}
                            setIsLoading={setIsLoading}
                        />
                        <button
                            className="bg-[#ff914d] text-xl text-white px-6 py-2 rounded-xl w-64 max-w-xs"
                            onClick={clearSelection}
                        >
                            {messages[language].clear_selection}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}