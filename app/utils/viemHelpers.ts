import { publicClient } from '@/lib/viemClient';
import { getContract, WalletClient } from 'viem';

export const CONTRACT_ADDRESS = "0x918EC10e58DC41955328E07eee449b1455910cb8";
export const WLD_ADDRESS = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";

export const LOTTERY_ABI = [
    {
        type: "function",
        name: "comprarBoleto",
        stateMutability: "payable",
        inputs: [
            { name: "_loteriaId", type: "uint256" },
            { name: "_numero", type: "uint8" },
            {
                name: "permit",
                type: "tuple",
                components: [
                {
                    name: "permitted",
                    type: "tuple",
                    components: [
                    { name: "token", type: "address" },
                    { name: "amount", type: "uint256" }
                    ]
                },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
                ]
            },
            {
                name: "transferDetails",
                type: "tuple",
                components: [
                { name: "to", type: "address" },
                { name: "requestedAmount", type: "uint256" }
                ]
            },
            { name: "signature", type: "bytes" }
            ],
            outputs: []
        },
        {
            type: "function",
            name: "comprarBoletos",
            stateMutability: "payable",
            inputs: [
            { name: "_loteriaId", type: "uint256" },
            { name: "_numeros", type: "uint8[]" },
            {
                name: "permit",
                type: "tuple",
                components: [
                {
                    name: "permitted",
                    type: "tuple",
                    components: [
                    { name: "token", type: "address" },
                    { name: "amount", type: "uint256" }
                    ]
                },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
                ]
            },
            {
                name: "transferDetails",
                type: "tuple",
                components: [
                { name: "to", type: "address" },
                { name: "requestedAmount", type: "uint256" }
                ]
            },
            { name: "signature", type: "bytes" }
            ],
            outputs: []
        },
        {
            type: "function",
            name: "verCompradores",
            stateMutability: "view",
            inputs: [
                { name: "_loteriaId", type: "uint256" }
            ],
            outputs: [
                { type: "address[100]" }
            ]
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "usuario",
                    "type": "address"
                }
                ],
                "name": "obtenerBoletosUsuario",
                "outputs": [
                {
                    "components": [
                    {
                        "internalType": "uint256",
                        "name": "loteriaId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "numero",
                        "type": "uint8"
                    }
                    ],
                    "internalType": "struct WorldcoinLoteria.BoletoUsuario[]",
                    "name": "",
                    "type": "tuple[]"
                }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            
        {
            type: "function",
            name: "verNumeroGanador",
            stateMutability: "view",
            inputs: [
                { name: "_loteriaId", type: "uint256" }
            ],
            outputs: [
                { type: "uint8" }
            ]
        },
        {
            type: "function",
            name: "contadorLoterias",
            stateMutability: "view",
            inputs: [],
            outputs: [
                { type: "uint256" }
            ]
        },
        {
            type: "function",
            name: "obtenerUltimaLoteriaActivaPorTipo",
            stateMutability: "view",
            inputs: [
                { name: "tipo", type: "string" }
            ],
            outputs: [
                {
                    type: "tuple",
                    components: [
                        { name: "id", type: "uint256" },
                        { name: "tipo", type: "string" },
                        { name: "cerrada", type: "bool" },
                        { name: "numeroGanador", type: "uint256" },
                        { name: "boletosVendidos", type: "uint256" }
                    ]
                }
            ]
        },
        {
            type: "function",
            name: "verHistorial",
            stateMutability: "view",
            inputs: [],
            outputs: [
                {
                    type: "tuple[]",
                    components: [
                        { name: "id", type: "uint256" },
                        { name: "nombre", type: "string" },
                        { name: "numeroGanador", type: "uint8" },
                        { name: "ganador", type: "address" },
                        { name: "premio", type: "uint256" },
                        { name: "fechaCierre", type: "uint256" }
                    ]
                }
            ]
        },
        {
            type: "function",
            name: "loterias",
            stateMutability: "view",
            inputs: [
                { name: "_id", type: "uint256" }
            ],
            outputs: [
                { name: "nombre", type: "string" },
                { name: "precio", type: "uint256" },
                { name: "totalBoletos", type: "uint8" },
                { name: "boletosVendidos", type: "uint8" },
                { name: "cerrada", type: "bool" },
                { name: "numeroGanador", type: "uint8" },
                { name: "id", type: "uint256" }
            ]
        },
        {
            type: "function",
            name: "owner",
            stateMutability: "view",
            inputs: [],
            outputs: [
                { type: "address" }
            ]
        },
    {
        type: "function",
        name: "verLoteriasActivas",
        stateMutability: "view",
        inputs: [],
        outputs: [
            {
                type: "tuple[]",
                components: [
                { name: "id", type: "uint256" },
                { name: "nombre", type: "string" },
                { name: "boletosVendidos", type: "uint8" },
                { name: "totalBoletos", type: "uint8" },
                { name: "cerrada", type: "bool" },
                ],
            },
            ],
        },
        
        {
            type: "function",
            name: "rescatarPremio",
            stateMutability: "nonpayable",
            inputs: [
                { name: "_loteriaId", type: "uint256" }
            ],
            outputs: []
        },
        {
            type: "event",
            name: "BoletoComprado",
            inputs: [
                { name: "id", type: "uint256", indexed: true },
                { name: "comprador", type: "address", indexed: true },
                { name: "numero", type: "uint8" }
            ]
        },
        {
            type: "event",
            name: "LoteriaCerrada",
            inputs: [
                { name: "id", type: "uint256", indexed: true },
                { name: "numeroGanador", type: "uint8" },
                { name: "ganador", type: "address" },
                { name: "premio", type: "uint256" }
            ]
        }
    ];

export function getLotteryContract() {
    return getContract({
        address: CONTRACT_ADDRESS,
        abi: LOTTERY_ABI,
        client: { public: publicClient },
        });
    }

    export function getLotteryContractWithWallet(walletClient: WalletClient) {
        return getContract({
            address: CONTRACT_ADDRESS,
            abi: LOTTERY_ABI,
            client: { wallet: walletClient },
            });
        }