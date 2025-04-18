import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
        }
    }

// Dirección del contrato desplegado en Worldchain Sepolia
const CONTRACT_ADDRESS = "0x549473b818B1712d21f029E7856b7498Ba650178";

// ABI extraído directamente del contrato
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
    "event BoletoComprado(uint256 indexed id, address indexed comprador, uint8 numero)",
    "event LoteriaCerrada(uint256 indexed id, uint8 numeroGanador, address ganador, uint256 premio)",
    "function rescatarPremio(uint256 _loteriaId) external",
    ];

    // Conecta MetaMask y devuelve el contrato
    export const getLotteryContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask no está disponible");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, LOTTERY_ABI, signer);
    return contract;
};

export const provider = new ethers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");