"use client";

import { useEffect, useState, useContext } from "react";
import { getLotteryContract, } from "@/app/utils/viemHelpers";
import { publicClient } from "@/lib/viemClient";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { lotteryTypes } from "../utils/lotteryTypes";
import { messages } from "@/data/translations";
import ProtectedRoute from "@/components/ProtectedRoute";

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
                const historial = await contract.read.verHistorial();

                // Obtener logs del evento LoteriaCerrada
                const logs = await publicClient.getLogs({
                    address: contract.address,
                    event: {
                        type: "event",
                        name: "LoteriaCerrada",
                        inputs: [
                            { name: "id", type: "uint256", indexed: true },
                            { name: "numeroGanador", type: "uint8", indexed: false },
                            { name: "ganador", type: "address", indexed: false },
                            { name: "premio", type: "uint256", indexed: false },
                        ],
                        anonymous: false,
                    },
                    fromBlock: BigInt(0),
                    toBlock: "latest",
                });

                const txHashMap: Record<string, string> = {};
                for (const log of logs) {
                    const idStr = log.args?.id?.toString();
                    if (idStr && log.transactionHash) {
                        txHashMap[idStr] = log.transactionHash;
                    }
                }

                const loterias = (historial as any[]).map((loteria): LotteryHistory => ({
                    id: BigInt(loteria.id),
                    nombre: loteria.nombre,
                    numeroGanador: BigInt(loteria.numeroGanador),
                    ganador: loteria.ganador,
                    premio: BigInt(loteria.premio),
                    fecha: loteria.fechaCierre ? BigInt(loteria.fechaCierre).toString() : undefined,
                    transactionHash: txHashMap[BigInt(loteria.id).toString()] ?? "",
                }));

                setHistory(loterias.reverse());
            } catch (err) {
                console.error("Error al obtener historial de loterías:", err);
                setError("Error al cargar el historial.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[url('/images/bg_history.jpg')] bg-cover bg-center bg-fixed p-6">
                <h1 className="text-3xl font-bold text-center text-black mb-6">
                    {messages[language].history}
                </h1>

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
                                    ID: #{lottery.id.toString()} <br />
                                    {messages[language][`lottery_${nombreKey}` as keyof typeof messages["en"]] ?? lottery.nombre}
                                </h2>

                                <p>🎯 {messages[language].winningNumber}</p>
                                <div className={`mt-4 text-6xl font-bold tracking-widest ${config.textColor}`}>
                                    {lottery.numeroGanador !== undefined && !isNaN(Number(lottery.numeroGanador))
                                        ? Number(lottery.numeroGanador).toString().padStart(2, "0")
                                        : "??"}
                                </div>

                                <p className="mt-3 text-black">
                                    💰{messages[language].prize} {(Number(lottery.premio) / 1e18).toFixed(0)} WLD
                                </p>

                                <p className="mt-2 text-black text-sm break-all">
                                    {messages[language].winner}:{" "}
                                    {lottery.ganador
                                        ? `${lottery.ganador.slice(0, 6)}...${lottery.ganador.slice(-4)}`
                                        : "Desconocido"}
                                </p>

                                <p className="mt-2 text-black text-sm">
                                    🕒{" "}
                                    {lottery.fecha
                                        ? new Date(Number(lottery.fecha) * 1000).toLocaleString("default", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                            })
                                        : "Desconocida"}
                                </p>

                                {lottery.transactionHash && (
                                    <a
                                        href={`https://worldscan.org/tx/${lottery.transactionHash}`}
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
        </ProtectedRoute>
    );
};

export default HistoryPage;