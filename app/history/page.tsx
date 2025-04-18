"use client";

import { useEffect, useState, useContext } from "react";
import { getLotteryContract } from "@/app/utils/ethersHelpers";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { lotteryTypes } from "../utils/lotteryTypes";
import { messages } from "@/data/translations";


interface LotteryHistory {
    id: bigint;
    nombre: string;
    numeroGanador: bigint;
    ganador: string;
    premio: bigint;
    fecha?: string;
    transactionHash?: string;
}

const HistoryPage = () => {
    const [history, setHistory] = useState<LotteryHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const contract = await getLotteryContract();
                const result: any[] = await contract.verHistorial();

                const enrichedHistory = await Promise.all(
                    result.map(async (lottery: any) => {
                        try {
                            const enrichedLottery = {
                                id: lottery[0],
                                nombre: lottery[1],
                                numeroGanador: lottery[2],
                                ganador: lottery[3],
                                premio: lottery[4],
                                fecha: lottery.fecha,
                            };

                            const events = await contract.queryFilter(
                                contract.filters.LoteriaCerrada(BigInt(enrichedLottery.id)),
                                0,
                                "latest"
                            );

                            if (events.length > 0) {
                                const event = events[0];
                                const block = await event.getBlock();
                                const timestamp = block.timestamp;
                                const fecha = new Date(timestamp * 1000).toLocaleString("es-ES", {
                                    timeZone: "UTC",
                                    hour12: false,
                                });

                                const transactionHash = event.transactionHash;

                                return { ...enrichedLottery, fecha, transactionHash };
                            } else {
                                return { ...enrichedLottery, fecha: "Desconocida", transactionHash: "" };
                            }
                        } catch (err) {
                            console.warn("Error al obtener la fecha:", err);
                            return { ...lottery, fecha: "Error al obtener fecha", transactionHash: "" };
                        }
                    })
                );

                setHistory(enrichedHistory);
            } catch (err) {
                console.error(err);
                setError("Error al cargar el historial de loterías.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <main className="min-h-screen bg-[url('/images/bg_history.jpg')] bg-cover bg-center bg-fixed p-6">
            <h1 className="text-3xl font-bold text-center text-black mb-6">{messages[language].history}</h1>

            {isLoading && <p className="text-center text-black">{messages[language].loading}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 mb-14 text-center">
                {history.map((lottery, index) => {
                    const nombreKey = lottery.nombre.toLowerCase();
                    const config = lotteryTypes[nombreKey as keyof typeof lotteryTypes] || lotteryTypes.quartz;

                    return (
                        <div
                            key={index}
                            className={`rounded-3xl shadow-md border-8 p-5 w-64 mx-auto transition-transform hover:scale-[1.02] ${config.boColor} ${config.bgColor}`}
                            >
                            <h2 className="text-lg font-semibold text-black">
                            ID: #{lottery.id.toString()} <br></br>{messages[language][`lottery_${nombreKey}` as keyof typeof messages["en"]] ?? lottery.nombre}
                            </h2>
                            
                            <p>🎯 {messages[language].winningNumber}</p>
                            {/* Número ganador destacado */}
                            <div className={`mt-4 text-6xl font-bold tracking-widest ${config.textColor}`}>
                                {lottery.numeroGanador !== undefined && !isNaN(Number(lottery.numeroGanador))
                                ? Number(lottery.numeroGanador).toString().padStart(2, "0")
                                : "??"}
                            </div>

                            {/* Premio en ETH */}
                            <p className="mt-3 text-black">
                                💰{messages[language].prize} {(Number(lottery.premio) / 1e18).toFixed(4)} ETH
                            </p>

                            {/* Billetera del ganador truncada y dentro de la tarjeta */}
                            <p className="mt-2 text-black text-sm break-all">
                                {messages[language].winner}: {lottery.ganador
                                ? `${lottery.ganador.slice(0, 6)}...${lottery.ganador.slice(-4)}`
                                : "Desconocido"}
                            </p>

                            {/* Fecha */}
                            <p className="mt-2 text-black text-sm">🕒 {lottery.fecha ?? "Desconocida"}</p>

                            {/* Enlace a la transacción */}
                            {lottery.transactionHash && (
                                <a
                                href={`https://sepolia.worldscan.org/tx/${lottery.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-3 text-sm text-blue-600 underline"
                                >
                                🔗 {messages[language].view}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default HistoryPage;