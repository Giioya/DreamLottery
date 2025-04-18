export default function LotteryNumbers({ numbers, purchasedNumbers, selectedNumber, setSelectedNumber }: any) {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-6 p-4 rounded-lg bg-white shadow-md border-4">
            {numbers.map((num: number) => (
                <button
                    key={num}
                    className={`w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center border rounded-md
                        ${purchasedNumbers.includes(num) ? "bg-red-300 text-white font-bold" : "bg-gray-200 text-black"}
                        ${selectedNumber === num && !purchasedNumbers.includes(num) ? "bg-green-500 text-white" : ""}
                        hover:bg-opacity-75 disabled:opacity-50`}
                    onClick={() => !purchasedNumbers.includes(num) && setSelectedNumber(num)}
                    disabled={purchasedNumbers.includes(num)}
                >
                    {num.toString().padStart(2, "0")}
                </button>
            ))}
        </div>
    );
}
