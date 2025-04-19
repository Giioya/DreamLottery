"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { getLotteryContract } from "@/app/utils/ethersHelpers";
import { ArrowLeft } from "lucide-react";
import { ethers } from "ethers";
import { sendTransaction } from '@/app/utils/ethersHelpers';  // Asegúrate de importar la función

const lotteryTypes = {
    quartz: {
        color: "bg-[#f3ffca]",
        size: "text-lg",
        selectColor: "bg-green-400",
        boColor: "border-green-600",
        textColor: "text-green-600",
        price: "0.00005",
        prize: "0.004 ETH",
        bgColor: "bg-green-200",
        backgroundImage: "/images/bg_quarzt.jpg",
        titleImage: "/images/title_quartz.png",
    },
    citrine: {
        color: "bg-[#ffefbd]",
        size: "text-lg",
        selectColor: "bg-[#ff6c01]",
        boColor: "border-[#ff6c01]",
        textColor: "text-black",
        price: "0.0001",
        prize: "0.008 ETH",
        bgColor: "bg-yellow-200",
        backgroundImage: "/images/bg_citrine.jpg",
        titleImage: "/images/title_citrine.png",
    },
    amethyst: {
        color: "bg-[#f7ecff]",
        size: "text-lg",
        selectColor: "bg-[#903eca]",
        boColor: "border-[#903eca]",
        textColor: "text-purple-600",
        price: "0.0003",
        prize: "0.024 ETH",
        bgColor: "bg-purple-200",
        backgroundImage: "/images/bg_amethyst.png",
        titleImage: "/images/title_amethyst.png",
    },
    saphire: {
        color: "bg-[#d5f0ff]",
        size: "text-lg",
        selectColor: "bg-[#3554f7]",
        boColor: "border-[#3554f7]",
        textColor: "text-blue-600",
        price: "0.0005",
        prize: "0.04 ETH",
        bgColor: "bg-blue-200",
        backgroundImage: "/images/bg_sapphire.png",
        titleImage: "/images/title_sapphire.png",
    },
    diamond: {
        color: "bg-[#fff5fb]",
        size: "text-lg",
        selectColor: "bg-[#4b002a]",
        boColor: "border-[#4b002a]",
        textColor: "text-black drop-shadow-[0_0_5px_white]",
        price: "0.001",
        prize: "0.08 ETH",
        bgColor: "bg-gray-200",
        backgroundImage: "/images/bg_diamond.png",
        titleImage: "/images/title_diamond.png",
    },
};

export default function LotteryPage({ params }: { params: { type: string } }) {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [purchasedNumbers, setPurchasedNumbers] = useState<number[]>([]);
    const [lotteryId, setLotteryId] = useState<number | null>(null);

    const type = params.type as keyof typeof lotteryTypes;
    const lottery = lotteryTypes[type] || lotteryTypes.quartz;
    const numbers = Array.from({ length: 100 }, (_, i) => i);

    useEffect(() => {
        const fetchActiveLottery = async () => {
            try {
                const contract = await getLotteryContract();
                const data = await contract.obtenerUltimaLoteriaActivaPorTipo(
                    type.charAt(0).toUpperCase() + type.slice(1)
                );
                setLotteryId(Number(data.id));
            } catch (err) {
                console.error("Error al obtener la última lotería activa:", err);
            }
        };

        fetchActiveLottery();
    }, [type]);

    useEffect(() => {
        if (lotteryId === null) return;

        const fetchPurchased = async () => {
            try {
                const contract = await getLotteryContract();
                const buyers: string[] = await contract.verCompradores(lotteryId);
                const purchased: number[] = buyers
                    .map((addr, idx) => (addr !== ethers.ZeroAddress ? idx : null))
                    .filter((v) => v !== null) as number[];
                setPurchasedNumbers(purchased);
            } catch (err) {
                console.error("Error al obtener boletos comprados:", err);
            }
        };

        fetchPurchased();
    }, [lotteryId]);

    const toggleNumberSelection = (num: number) => {
        setSelectedNumbers((prev) =>
            prev.includes(num)
                ? prev.filter((n) => n !== num)
                : prev.length < 10
                ? [...prev, num]
                : prev
        );
    };

    const clearSelection = () => setSelectedNumbers([]);

    const handleBuyTicket = async () => {
        if (selectedNumbers.length === 0) {
            setErrorMessage("Debes seleccionar al menos un número.");
            return;
        }

        if (lotteryId === null) {
            setErrorMessage("No se pudo obtener la lotería activa.");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const transactionDetails = {
                contractAddress: '0x549473b818B1712d21f029E7856b7498Ba650178', // Dirección del contrato
                functionName: 'comprarBoleto', // Función a llamar
                args: [lotteryId, selectedNumbers[0]], // Argumentos para la función, aquí tomamos el primer número seleccionado
                value: ethers.parseUnits(lottery.price, "ether").toString(16),
            };

            const result = await sendTransaction(transactionDetails);
            console.log('Resultado de la transacción:', result);

            alert("✅ ¡Boletos comprados exitosamente!");
            setSelectedNumbers([]);
            const contract = await getLotteryContract();
            const buyers: string[] = await contract.verCompradores(lotteryId);
            const purchased: number[] = buyers
                .map((addr, idx) => (addr !== ethers.ZeroAddress ? idx : null))
                .filter((v) => v !== null) as number[];
            setPurchasedNumbers(purchased);
        } catch (error) {
            console.error(error);
            setErrorMessage("❌ Ocurrió un error al comprar los boletos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Fondo fijo */}
            <div
                className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${lottery.backgroundImage})` }}
            />

            {/* Flechita atrás funcional */}
            <div className="fixed top-6 left-4 z-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Título visual atrás */}
            <div className="fixed top-0 left-0 w-full z-0 pointer-events-none">
                {lotteryId !== null && (
                    <div className="w-full max-w-sm h-36 mt-4 mx-auto flex justify-center items-center relative">
                        <img
                            src={lottery.titleImage}
                            alt="Fondo título"
                            className="absolute w-256 h-256 object-contain pt-60 mt-80"
                        />
                        <h1
                            className={`${lottery.size} font-bold pt-4 mt-40 z-10 text-center ${lottery.textColor}`}
                        >
                            ID #{lotteryId}.{" "}
                            {
                                messages[language][
                                `lottery_${type}` as keyof typeof messages["en"]
                                ]
                            }
                        </h1>
                    </div>
                )}

                <div className="flex flex-col items-center mt-20">
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
                            {messages[language].price} ${lottery.price}
                        </span>
                        <span className="relative text-2xl font-black uppercase underline">
                            {messages[language].price} ${lottery.price}
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
            <div className="relative z-10 w-full h-full overflow-y-auto pt-40 mt-40 px-6">
                <div
                    className={`grid grid-cols-5 gap-2 p-4 ${lottery.boColor} ${lottery.color} shadow-md rounded-xl border-4 h-[300px] overflow-y-scroll`}
                >
                    {numbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => toggleNumberSelection(number)}
                            className={`${
                                selectedNumbers.includes(number)
                                    ? "bg-green-600 text-white"
                                    : lottery.selectColor
                            } ${lottery.size} rounded-md px-2 py-1`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                {/* Mensaje de error */}
                {errorMessage && (
                    <div className="text-center mt-4 text-red-500">{errorMessage}</div>
                )}

                {/* Botón de confirmación */}
                <div className="w-full flex justify-center mt-4">
                    <button
                        onClick={handleBuyTicket}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Procesando..." : "Comprar Boletos"}
                    </button>
                </div>
            </div>
        </div>
    );
}