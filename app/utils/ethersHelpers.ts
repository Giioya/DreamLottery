import { ethers } from "ethers";
import { MiniKit } from "@worldcoin/minikit-js"; // Importamos MiniKit

declare global {
    interface Window {
        ethereum?: any;
    }
}

// Dirección del contrato desplegado en Worldchain Mainnet
export const CONTRACT_ADDRESS = "0x549473b818B1712d21f029E7856b7498Ba650178";

// ABI del contrato
export const LOTTERY_ABI = [
    "function comprarBoleto(uint256 _loteriaId, uint8 _numero) external payable",
    "function comprarBoletos(uint256 _loteriaId, uint8[] _numeros) external payable",
    "function verCompradores(uint256 _loteriaId) external view returns (address[100])",
    "function verNumeroGanador(uint256 _loteriaId) external view returns (uint8)",
    "function contadorLoterias() external view returns (uint256)",
    "function obtenerUltimaLoteriaActivaPorTipo(string tipo) external view returns (tuple(uint256 id, string tipo, bool cerrada, uint256 numeroGanador, uint256 boletosVendidos))",
    "function verHistorial() external view returns (tuple(uint256 id, string nombre, uint8 numeroGanador, address ganador, uint256 premio)[])",
    "function loterias(uint256) external view returns (string nombre, uint256 precio, uint8 totalBoletos, uint8 boletosVendidos, bool cerrada, uint8 numeroGanador, uint256 id)",
    "function owner() external view returns (address)",
    "function verLoteriasActivas() external view returns (tuple(uint256 id, string nombre, uint8 boletosVendidos, uint8 totalBoletos, bool cerrada)[])",
    "function rescatarPremio(uint256 _loteriaId) external",
    "event BoletoComprado(uint256 indexed id, address indexed comprador, uint8 numero)",
    "event LoteriaCerrada(uint256 indexed id, uint8 numeroGanador, address ganador, uint256 premio)",
];

// Provider de solo lectura usando el RPC oficial de World Chain
export const publicProvider = new ethers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");

// Función para obtener el contrato (conectado o en solo lectura)
export const getLotteryContract = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
        try {
            // Verificamos si el usuario tiene la billetera de Worldcoin instalada (MiniKit)
            if (MiniKit.isInstalled()) {
                // Si MiniKit está instalado, utilizamos la billetera de Worldcoin para la interacción
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                return new ethers.Contract(CONTRACT_ADDRESS, LOTTERY_ABI, signer);
            } else {
                // Si MiniKit no está disponible, usamos la billetera tradicional si está conectada
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                return new ethers.Contract(CONTRACT_ADDRESS, LOTTERY_ABI, signer);
            }
        } catch (error) {
            console.error("Error al conectar wallet:", error);
            // Si ocurre un error, usamos el proveedor público para solo lecturas
            return new ethers.Contract(CONTRACT_ADDRESS, LOTTERY_ABI, publicProvider);
        }
    } else {
        // Si no se detecta billetera, usamos el proveedor público
        console.log("No wallet detectada, usando provider público");
        return new ethers.Contract(CONTRACT_ADDRESS, LOTTERY_ABI, publicProvider);
    }
};

// Función para forzar la conexión de la Wallet (como lo haces con MiniKit)
export const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
        try {
            // Verificamos si el usuario tiene la billetera de Worldcoin instalada
            if (!MiniKit.isInstalled()) {
                alert('Por favor abre esta página desde World App');
                return;
            }

            // Solicitamos la conexión de la billetera
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Wallet conectada");
        } catch (error) {
            console.error("Error al solicitar conexión:", error);
        }
    } else {
        console.error("No wallet detectada en el navegador");
    }
};

// Función de Send Transaction para interactuar con el contrato
export const sendTransaction = async (transactionDetails: { contractAddress: string, functionName: string, args: any[], value?: string }) => {
    if (!MiniKit.isInstalled()) {
        console.error('MiniKit no está instalado.');
        return;
    }

    // Crear la transacción
    const transactionPayload = {
        transaction: [
            {
                address: transactionDetails.contractAddress,
                abi: LOTTERY_ABI,
                functionName: transactionDetails.functionName,
                value: transactionDetails.value ? transactionDetails.value : undefined,
                args: transactionDetails.args,
            },
        ],
    };

    try {
        const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction(transactionPayload);
        console.log('Transaction Sent:', finalPayload);
        return finalPayload;
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
    }
};