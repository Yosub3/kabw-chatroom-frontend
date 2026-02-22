import { StatCard } from "@/ui/StatCard";
import formatRupiah from "@/utils/formatRupiah";
import { 
    FaPiggyBank,
    FaWallet,
    FaArrowDown,
    FaArrowUp
} from "react-icons/fa";

export default function DashboardPage() {
    const dateNow = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return(
        <div className="p-3 space-y-6">
            {/* Welcome Message */}
            <div className="flex flex-col gap-8 text-white bg-linear-to-r from-indigo-900 to-indigo-600 rounded-xl p-6">
                <div className="flex justify-between items-start flex-warp gap-2">
                    <div>
                        <h2 className="text-3xl font-semibold">Welcome back, User!</h2>
                        <p className="text-md mt-1 font-normal">
                            Insights at glance: empowering your financial journey.
                        </p>
                    </div>

                    <div className="text-right text-md text-white">
                        <p className="font-medium">
                            {dateNow}
                        </p>
                    </div>
                </div>
                {/* Stat content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Total Balance"
                        value={formatRupiah(300000)}
                        icon={<FaWallet size={24}/>}
                        change="This Month"
                        color="text-gray-600"
                    />
                    <StatCard 
                        title="Total Savings"
                        value={formatRupiah(100000)}
                        icon={<FaPiggyBank size={24}/>}
                        change="For Recommendation"
                        color="text-green-500"
                    />
                    <StatCard 
                        title="Total Income"
                        value={formatRupiah(2000000)}
                        icon={<FaArrowUp size={24}/>}
                        change="This Month"
                        color="text-gray-600"
                    />
                    <StatCard 
                        title="Total Expense"
                        value={formatRupiah(700000)}
                        icon={<FaArrowDown size={24}/>}
                        change="This Month"
                        color="text-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}