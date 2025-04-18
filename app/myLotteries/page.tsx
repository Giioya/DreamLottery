"use client";

import { useEffect, useState, useContext } from "react";
import { getLotteryContract } from "@/app/utils/ethersHelpers";
import { ethers } from "ethers";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { lotteryTypes } from "../utils/lotteryTypes";
import { messages } from "@/data/translations";

interface UserLottery {
    id: number;
    nombre: string;
    numeros: number[];
    }

    export default function LotteryPage({ params }: { params: { type: string } }) {
    const [userLotteries, setUserLotteries] = useState<UserLottery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { language } = useContext(LanguageContext) as {
        language: keyof typeof messages;
    };
    const [loteriasActivas, setLoteriasActivas] = useState<Set<number>>(new Set());
    const [vendidosPorLoteria, setVendidosPorLoteria] = useState<Record<number, { vendidos: number; total: number }>>({});

    const type = params.type as keyof typeof lotteryTypes;
    const lottery = lotteryTypes[type] || lotteryTypes.quartz;

    useEffect(() => {
        const fetchUserLotteries = async () => {
        try {
            setIsLoading(true);
            const contract = await getLotteryContract();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Obtener loterías activas
            const result = await contract.verLoteriasActivas();
            const activasIds = new Set<number>();
            const vendidosMap: Record<number, { vendidos: number; total: number }> = {};

            for (const l of result) {
            const id = Number(l.id);
            activasIds.add(id);
            vendidosMap[id] = {
                vendidos: Number(l.boletosVendidos),
                total: Number(l.totalBoletos),
            };
            }

            setLoteriasActivas(activasIds);
            setVendidosPorLoteria(vendidosMap);

            // Obtener todas las loterías del usuario
            const totalLoterias = await contract.contadorLoterias();
            const lotteries: UserLottery[] = [];

            for (let id = 0; id < totalLoterias; id++) {
            const compradores: string[] = await contract.verCompradores(id);
            const userNumbers: number[] = compradores
                .map((addr, idx) =>
                addr.toLowerCase() === address.toLowerCase() ? idx : -1
                )
                .filter((n) => n !== -1);

            if (userNumbers.length > 0) {
                const info = await contract.loterias(id);
                lotteries.push({
                id,
                nombre: info.nombre,
                numeros: userNumbers,
                });
            }
            }

            setUserLotteries(lotteries);
        } catch (err) {
            console.error(err);
            setError("Error al cargar tus loterías.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchUserLotteries();
    }, []);

    return (
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
            const isActiva = loteriasActivas.has(lottery.id);
            const vendidos = vendidosPorLoteria[lottery.id]?.vendidos ?? "—";
            const total = vendidosPorLoteria[lottery.id]?.total ?? "—";

            return (
                <div
                key={lottery.id}
                className={`rounded-3xl shadow-md border-8 p-5 w-64 mx-auto transition-transform hover:scale-[1.02] ${config.boColor} ${config.bgColor}`}
                >
                <h2 className="text-lg font-semibold text-black">
                    ID # {lottery.id} {messages[language][`lottery_${nombreKey}` as keyof typeof messages["en"]] ?? lottery.nombre}
                </h2>
                <div className={`mt-4 text-3xl font-bold tracking-widest ${config.textColor}`}>
                    {lottery.numeros.map((n) => n.toString().padStart(2, "0")).join(" - ")}
                </div>
                <div className="mt-2 text-black">
                    <p>{messages[language].prize} {config.prize}</p>
                    <p className="mt-2 font-bold underline">
                    {isActiva ? (
                        <>
                        {vendidos}/{total} {messages[language].Purchased_tickets}
                        </>
                    ) : (
                        messages[language].lottery_ended
                    )}
                    </p>
                </div>
                </div>
            );
            })}
        </div>
        </main>
    );
}