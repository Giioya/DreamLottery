"use client";

import { useEffect, useState, useContext } from "react";
import { getLotteryContract } from "@/app/utils/viemHelpers";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { lotteryTypes } from "@/app/utils/lotteryTypes";
import { messages } from "@/data/translations";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWallet } from "@/context/WalletAuthContext";
import { publicClient } from "@/lib/viemClient";

interface UserLottery {
    id: number;
    nombre: string;
    numeros: number[];
    numeroGanador?: number | null;
    esActiva: boolean;
}

interface LoteriaHistorial {
    id: bigint;
    nombre: string;
    numeroGanador: number;
    ganador: string;
    compradores: string[];
}

interface LoteriaActiva {
    id: bigint;
    nombre: string;
    boletosVendidos: bigint;
    totalBoletos: bigint;
}

interface LotteryHistory {
    id: bigint;
    nombre: string;
    numeroGanador: bigint;
    ganador: string;
    premio: bigint;
    fecha?: string;
    transactionHash?: string;
}

export default function LotteryPage({ params }: { params: { type: string } }) {
    const [userLotteries, setUserLotteries] = useState<UserLottery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [vendidosPorLoteria, setVendidosPorLoteria] = useState<Record<number, { vendidos: number; total: number }>>({});
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };
    const type = params.type as keyof typeof lotteryTypes;
    const lottery = lotteryTypes[type] || lotteryTypes.quartz;
    const { walletAddress } = useWallet();
    const [history, setHistory] = useState<LotteryHistory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!walletAddress) {
                console.warn("⚠️ Wallet no disponible aún");
                return;
            }
    
            setIsLoading(true);
    
            try {
                const contract = getLotteryContract();
    
                const [activas, historial, boletos] = await Promise.all([
                    contract.read.verLoteriasActivas() as Promise<LoteriaActiva[]>,
                    contract.read.verHistorial() as Promise<LoteriaHistorial[]>,
                    contract.read.obtenerBoletosUsuario([walletAddress]) as Promise<
                        { loteriaId: string; numero: number }[]
                    >,
                ]);
    
                const boletosPorLoteria: Record<number, number[]> = {};
                boletos.forEach(({ loteriaId, numero }) => {
                    const id = Number(loteriaId);
                    if (!boletosPorLoteria[id]) boletosPorLoteria[id] = [];
                    boletosPorLoteria[id].push(numero);
                });
    
                const historialMap: Record<number, LoteriaHistorial> = {};
                historial.forEach((l) => {
                    historialMap[Number(l.id)] = l;
                });
    
                const loterias: Record<number, UserLottery> = {};
    
                // Combinar activas e históricas
                const todasLoterias = new Set<number>([
                    ...activas.map((l) => Number(l.id)),
                    ...boletos.map((b) => Number(b.loteriaId)),
                ]);
    
                todasLoterias.forEach((id) => {
                    if (!boletosPorLoteria[id]) return;
    
                    const activa = activas.find((l) => Number(l.id) === id);
                    const historica = historialMap[id];
    
                    loterias[id] = {
                        id,
                        nombre: activa?.nombre ?? historica?.nombre ?? "Desconocida",
                        numeros: boletosPorLoteria[id],
                        numeroGanador: historica?.numeroGanador ?? null,
                        esActiva: Boolean(activa),
                    };
    
                    if (activa) {
                        vendidosPorLoteria[id] = {
                            vendidos: Number(activa.boletosVendidos),
                            total: Number(activa.totalBoletos),
                        };
                    }
                });
    
                setVendidosPorLoteria(vendidosPorLoteria);
                setUserLotteries(Object.values(loterias));
            } catch (error) {
                console.error("❌ Error cargando datos:", error);
                setError("Error al cargar tus loterías.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [walletAddress]);
    

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const contract = await getLotteryContract();
                const historial = await contract.read.verHistorial();

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
            <main className="min-h-screen bg-[url('/images/bg_mylotteries3.jpg')] bg-cover bg-center bg-fixed p-6">
                <h1 className="text-3xl font-bold text-center text-black mb-6">
                    {messages[language].my_lotteries}
                </h1>

                {isLoading && <p className="text-center text-black">{messages[language].charge_lotteries}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!isLoading && userLotteries.length === 0 && (
                    <p className="text-center text-black">{messages[language].no_loterries}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 mb-14 text-center">
                    {userLotteries.map((lottery) => {
                        const nombreKey = lottery.nombre.toLowerCase();
                        const config = lotteryTypes[nombreKey as keyof typeof lotteryTypes] || lotteryTypes.quartz;
                        const vendidos = vendidosPorLoteria[lottery.id]?.vendidos ?? "—";
                        const total = vendidosPorLoteria[lottery.id]?.total ?? "—";

                        return (
                            <div
                                key={lottery.id}
                                className={`rounded-3xl shadow-md border-8 p-5 w-64 mx-auto transition-transform hover:scale-[1.02] ${config.boColor} ${config.bgColor}`}
                            >
                                <h2 className="text-lg font-semibold text-black">
                                    ID #{lottery.id} - {messages[language][`lottery_${nombreKey}` as keyof typeof messages["en"]] ?? lottery.nombre}
                                </h2>
                                <p>{messages[language].prize} {config.prize}</p>

                                <div className="mt-4 text-black text-sm">
                                    {lottery.numeros.length > 0 ? (
                                        <>
                                            <p className="font-bold text-lg">{messages[language].your_numbers}</p>
                                            <div className={`text-3xl font-bold tracking-widest ${config.textColor}`}>
                                                {lottery.numeros
                                                    .sort((a, b) => a - b)
                                                    .map((n) => n.toString().padStart(2, "0"))
                                                    .join(" - ")}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="italic">{messages[language].no_loterries}</p>
                                    )}
                                </div>

                                <div className="mt-4 text-black">
                                    <div className="mt-2 font-bold">
                                        {lottery.esActiva && (
                                            <p>{vendidos}/{total} {messages[language].Purchased_tickets}</p>
                                        )}
                                        {lottery.numeroGanador !== null && lottery.numeroGanador !== undefined ? (
                                            <p className={`text-xl font-semibold ${config.textColor} mt-1`}>
                                                {messages[language].winningNumber} {lottery.numeroGanador}
                                            </p>
                                        ) : (
                                            <p className={`text-xl font-semibold ${config.textColor} mt-1`}>{messages[language].Gaming}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </ProtectedRoute>
    );
}