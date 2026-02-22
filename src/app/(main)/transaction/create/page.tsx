'use client'

import TransactionForm from "@/pages/TransactionForm";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/ui/Modal";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import { createTransaction } from "@/services/transaction";
import getTokenHeader from "@/utils/getTokenHeader";

export default function CreateTransactionPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState<ModalProps | null>(null);

    const handleSubmit = async (form: TransactionFormData) => {
        setIsSubmitting(true);
        try {
            await createTransaction({
                ...form,
                category_id: form.categoryId
            }, getTokenHeader());

            setModal({
                type: "success",
                message: "Transaction created successfully"
            })
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

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create transaction</h1>
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
            <TransactionForm 
                onSubmit={handleSubmit}
            />
        </div>
    );
}