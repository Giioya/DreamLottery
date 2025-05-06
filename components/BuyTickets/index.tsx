'use client'

import { useState, useContext, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react"
import { createPublicClient, http } from "viem"
import { worldchain } from "viem/chains"
import { CONTRACT_ADDRESS, WLD_ADDRESS, LOTTERY_ABI } from "@/app/utils/viemHelpers"
import { lotteryTypes } from "@/app/utils/lotteryTypes"
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { useRouter } from "next/navigation"

const APP_ID = 'app_2a360a2c64ab7b86cfe0f0ea283b2d6d'

type Props = {
    selectedNumbers: number[];
    className?: string;
    type: "stone" | "quartz" | "citrine" | "amethyst" | "sapphire" | "diamond";
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    lotteryId: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }

    const BuyTicketsWithPermit2 = ({
    selectedNumbers,
    className,
    type,
    setErrorMessage,
    lotteryId,
    setIsLoading,
    }: Props) => {
    const [transactionId, setTransactionId] = useState<string | null>(null)
    const [isError, setIsError] = useState<boolean>(false)
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    const publicClient = createPublicClient({
        chain: worldchain,
        transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
    })

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        client: publicClient,
        appConfig: {
        app_id: APP_ID,
        },
        transactionId: transactionId!,
    })

    const router = useRouter();
    useEffect(() => {
        if (isConfirmed) {
            router.push("/myLotteries"); // 👈 Redirige al confirmar
        }
    }, [isConfirmed, router]);

    const handleBuyTickets = async () => {
        setIsError(false)
        setIsLoading(true)

        // Obtenemos el precio por boleto de la lotería actual (por ejemplo, "0.5" WLD)
        const lottery = lotteryTypes[type]
        const ticketPrice = parseFloat(lottery.price) // Valor numérico (ej. 0.5)
        // Calculamos el monto total en wei: (ticketPrice * cantidad * 10^18)
        const amount = (ticketPrice * selectedNumbers.length * 10 ** 18).toString()

        // Construimos el objeto de Permit2 (estructura PermitTransferFrom)
        const permitTransfer = {
        permitted: {
            token: WLD_ADDRESS,
            amount, // monto total en wei
        },
        nonce: Date.now().toString(),
        deadline: Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString(), // 30 minutos en adelante
        }

        // Construimos el objeto transferDetails (estructura SignatureTransferDetails)
        const transferDetails = {
        to: CONTRACT_ADDRESS,
        requestedAmount: amount,
        }

        try {
        const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
            transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: LOTTERY_ABI,
                functionName: 'comprarBoletos',
                args: [
                lotteryId,
                selectedNumbers,
                permitTransfer,
                transferDetails,
                'PERMIT2_SIGNATURE_PLACEHOLDER_0',
                ],
            },
            ],
            // En la propiedad permit2 se envía la configuración para obtener la firma automáticamente
            permit2: [
            {
                ...permitTransfer,
                spender: CONTRACT_ADDRESS,
            },
            ],
        })


        if ('status' in finalPayload && finalPayload.status === 'error') {
            console.error("Error al enviar la transacción:", finalPayload)
            setErrorMessage("Error al procesar la transacción")
            setIsError(true)
        } else if ('transaction_id' in finalPayload) {
            setTransactionId(finalPayload.transaction_id)
        } else {
            console.error("No se encontró transaction_id en la respuesta:", finalPayload)
            setErrorMessage("No se recibió transaction_id de la transacción.")
            setIsError(true)
        }
        } catch (err: any) {
        console.error("Error inesperado al enviar la transacción:", err)
        setErrorMessage("Error inesperado al enviar la transacción.")
        setIsError(true)
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <div>
        <button
            onClick={handleBuyTickets}
            className={className}
            disabled={selectedNumbers.length === 0}
        >
            {messages[language].buy_ticket}
        </button>

        {isConfirming && <p>Confirmando transacción...</p>}
        {isError && <p className="text-red-500">❌ Hubo un error en la transacción</p>}
        </div>
    )
}

export default BuyTicketsWithPermit2