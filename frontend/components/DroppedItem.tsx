"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";

const DraggableItem = ({ itemId }: { itemId: string, }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragItemRef = useRef(null);

    const startDragging = (e: any) => {
        setIsDragging(true);
        // Adjust the initial offset if your item isn't positioned at the top left corner
        (dragItemRef.current as any).style.position = 'absolute';
        setPosition({
            ...position,
            x: e.clientX - (dragItemRef.current as any).getBoundingClientRect().left,
            y: e.clientY - (dragItemRef.current as any).getBoundingClientRect().top,
        });
    };

    const onDrag = (e: any) => {
        if (!isDragging) return;
        const newX = e.clientX - position.x;
        const newY = e.clientY - position.y;
        (dragItemRef.current as any).style.left = `${newX}px`;
        (dragItemRef.current as any).style.top = `${newY}px`;
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDragging);
        } else {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDragging);
        }

        return () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDragging);
        };
    }, [isDragging]); // Re-run effect if isDragging changes

    return (
        <div
            ref={dragItemRef}
            onMouseDown={startDragging}
            style={{ position: 'absolute', left: `${position.x}px`, top: `${position.y}px` }}
            className='cursor-grab w-fit flex items-center gap-2 border rounded-2xl m-5 py-5 px-3 hover:bg-zinc-100 transition '>
            <Image className='text-2xl' src={itemId.toLowerCase()+".svg"} width={18}
                height={18} alt="icon" />
            <span className='font-medium'>{itemId}</span>
        </div>
    );
};

const DragAndDropContainer = ({ droppedItems }: { droppedItems: string[] }) => {

    return (
        <div className="relative w-full h-[80vh] flex justify-center items-center bg-gray-100">
            {droppedItems.map((item, idx) => <DraggableItem key={idx} itemId={item} />)}
        </div>
    );
};

export default DragAndDropContainer;