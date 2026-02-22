'use client'

import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import TransactionForm from "@/pages/TransactionForm";
import { editTransaction, getTransactionById } from "@/services/transaction";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import Modal from "@/ui/Modal";
import getTokenHeader from "@/utils/getTokenHeader";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTransactionPage() {
    let id = 0;
    const params = useParams();
    if(params && "id" in params){
        id = parseInt(params.id as string);
    }
    const router = useRouter();
    const [initialData, setInitialData] = useState<TransactionFormData>();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState<ModalProps | null>(null);

    const loadTransaction = async () => {
        try {
            const res = await getTransactionById(id, getTokenHeader());
            const tx = res.data;

            setInitialData({
                type: tx.type,
                amount: tx.amount,
                date: tx.date,
                note: tx.note,
                categoryId: tx.category_id
            });

        } catch (error) {
            if(error instanceof Error){
                setModal({
                    type: "danger",
                    message: error.message
                })
            } else {
                setModal({
                    type: "danger",
                    message: "Unknown error"
                })
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTransaction();
    }, [id,]);

    const handleSubmit = async (form: TransactionFormData) => {
        setIsSubmitting(true);
        try {
            await editTransaction(id, {
                ...form,
            }, getTokenHeader());

            setModal({
                type: "success",
                message: "Transaction updated successfully"
            });
        } catch (error) {
            if(error instanceof Error){
                setModal({
                    type: "danger",
                    message: error.message
                })
            } else {
                setModal({
                    type: "danger",
                    message: "Unknown error"
                })
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if(loading) {
        return (<LoadingSpinnerScreen />);
    }

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit transaction</h1>
            {isSubmitting && <LoadingSpinnerScreen />}
            {modal && (
                <Modal
                    type={modal.type}
                    message={modal.message}
                    onOk={() => {
                        setModal(null);
                        if(modal.type === "success") {router.push('/transaction')}
                    }}
                />
            )}
            {initialData && (
                <TransactionForm
                    initialData={{
                        ...initialData,
                        date: initialData.date.substring(0, 10),
                        categoryId: initialData.categoryId
                    }} 
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}