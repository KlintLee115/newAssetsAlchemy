import Image from "next/image";
import { RiQuestionLine } from "react-icons/ri";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DraggableElementProps {
    id: string;
    name: string;
    price: number;
    rpm?: number,
    credit?: number;
    style?: React.CSSProperties;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
    id,
    name,
    rpm,
    price,
    credit,
}) => {
    const dragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", id);
    };

    const dragOver = (e: React.DragEvent) => {
        e.stopPropagation();
    };


    return (
        <div
            id={id}
            draggable='true'
            onDragStart={dragStart}
            onDragOver={dragOver}
            className='cursor-grab'
        >
            <div className='flex justify-around border rounded-2xl m-5 py-5 px-3 hover:bg-zinc-100 transition '>
                <div className='w-full flex items-center gap-2'>
                    <Image className='text-2xl' src={name.toLowerCase() + ".svg"} width={18}
                        height={18} alt="icon" />
                    <span className='font-medium'>{name}</span>
                </div>

                <div className='flex flex-col mr-3'>
                    <div className='flex gap-2 items-center '>
                        <span className='text-sm text-zinc-700 font-bold'>
                            {price}
                        </span>
                        <Image
                            src={`coin.svg`}
                            alt='coin'
                            width={18}
                            height={18}
                        />
                    </div>

                    <div className='flex gap-1 items-center text-sm'>
                        <span className='text-zinc-500 font-semibold'>
                            {credit}
                        </span>
                        <HoverCard>
                            <HoverCardTrigger>
                                <RiQuestionLine className='text-zinc-500 text-base' />
                            </HoverCardTrigger>
                            <HoverCardContent side='left'>
                                You can purchase this asset through credit.
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraggableElement;
