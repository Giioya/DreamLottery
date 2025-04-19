import { ethers } from "ethers";

// Información de la red World Chain
const WORLD_CHAIN_RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public";
const WLD_CONTRACT_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003"; // Dirección del contrato de WLD
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
    ];

    export async function getBalance(walletAddress: string): Promise<number> {
        try {
    
            const provider = new ethers.JsonRpcProvider(WORLD_CHAIN_RPC_URL);
    
            const contract = new ethers.Contract(WLD_CONTRACT_ADDRESS, ERC20_ABI, provider);
    
            // Verifica si el contrato responde con los decimales
            const decimals = await contract.decimals();
    
            const balance: bigint = await contract.balanceOf(walletAddress);
    
            return Number(ethers.formatUnits(balance, decimals));
        } catch (error) {
            console.error("❌ Error al obtener el saldo:", error);
            return 0;
        }
    }
    
