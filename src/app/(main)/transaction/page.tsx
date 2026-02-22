'use client'

import { deleteTransaction, getTodayExpenseStats, getTransactions } from "@/services/transaction";
import { TransactionCard } from "@/ui/TransactionCard";
import formatRupiah from "@/utils/formatRupiah";
import getTokenHeader from "@/utils/getTokenHeader";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { ModalProps } from "@/interfaces/IModal";
import dynamic from 'next/dynamic'
import Modal from "@/ui/Modal";

export default function TransactionPage() {
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({total_expense: 0, count: 0});
    const [modal, setModal] = useState<ModalProps | null>(null);
    
    const loadTransactions = async () => {
        try {
            const res = await getTransactions({page: page, limit: limit, search: search, token: getTokenHeader()});
            setTransactions(res.data);
            setTotalPages(res.pagination.totalPages);
        } catch (error) {
            if(error instanceof Error){
                console.error({message: error.message, type: "danger"});
            } else {
                console.error({message: "Unknown error", type: "danger"});
            }
        }
    };

    const loadStats = async () => {
        try {
            const res = await getTodayExpenseStats(getTokenHeader());
            setStats(res.data);
        } catch (error) {
            if(error instanceof Error){
                console.error({message: error.message, type: "danger"});
            } else {
                console.error({message: "Unknown error", type: "danger"});
            }
        }
    }

    useEffect(() => {
        loadTransactions();
        loadStats();
    }, [page, search, limit])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDelete = async (id: number) => {
        setModal({
            type: "danger",
            message: "Are you sure you want to delete this transaction?",
            onOk: async () => {
                try {
                    await deleteTransaction(id, getTokenHeader());
                    setModal({
                        type: "success",
                        message: "Transaction deleted successfully",
                        onOk: () => setModal(null)
                    });

                    const res = await getTransactions({page: page, limit: limit, search: search, token: getTokenHeader()});
                    setTransactions(res.data);
                    setTotalPages(res.pagination.totalPages);
                } catch (error) {
                    console.error(error);
                    setModal({
                        type: "danger",
                        message: "Failed deleting transaction",
                        onOk: () => setModal(null)
                    })
                }
            },
            onCancel: () => setModal(null)
        });
    }

    return(
        <div className="p-4 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TransactionCard title="Today's Expense" value={formatRupiah(stats.total_expense)} />
                <TransactionCard title="Jumlah transaksi hari ini" value={stats.count} />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <FaSearch className="absolute top-2.5 left-3 text-gray-400"/>
                    <input 
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Cari transaksi..."
                        className="pl-10 pr-4 py-2 border rounded-md w-full text-sm" 
                    />
                </div>

                <Link 
                    href="/transaction/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center 
                    justify-center gap-2 hover:bg-indigo-700 w-full sm:w-fit"
                >
                    <FaPlus /> Buat transaksi
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <div className="min-w-150">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="p-3 ">No</th>
                                <th>Nama</th>
                                <th>Waktu</th>
                                <th>Jumlah</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx, index) => {
                                    const date = new Date(tx.date).toLocaleDateString("id-ID");
                                    return (
                                    <tr key={String(index)} className="border-t text-gray-700">

                                        <td className="p-4">
                                            {(page - 1) * limit + index + 1}
                                        </td>

                                        <td>
                                            <div className="font-semibold">{tx.category.name}</div>
                                            <div className="text-xs text-gray-500">{tx.note}</div>
                                        </td>
                                        <td>{date}</td>
                                        <td className={`font-medium ${
                                            tx.type === "expense" ? "text-red-500" : "text-green-500"
                                        }`}
                                        >
                                            {tx.type === "expense" ? "-" : "+"}
                                            {formatRupiah(tx.amount)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/transaction/edit/${tx.id}`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(tx.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash className="hover:cursor-pointer"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-500">Tidak ada transaksi</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {modal && (
                        <Modal
                            type={modal.type}
                            message={modal.message}
                            onOk={modal.onOk}
                            onCancel={modal.onCancel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}