export default function MessageBubble({ message, userId }: { message: string, userId: number }) {
    return (

        <div className={`flex ${userId === 1 ? 'flex-row-reverse' : ''} gap-2.5`}>
            <div className="flex flex-col w-full max-w-[320px] md:max-w-xl leading-1.5 p-4 bg-neutral-200 rounded-md">
                <p className="text-sm py-2.5 text-body">{message}</p>
            </div>
        </div>
    );
}