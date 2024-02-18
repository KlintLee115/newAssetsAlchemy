interface DropZoneProps {
    onDrop: (id: string) => void;
    style?: React.CSSProperties;
    children?: any;
    setPopUpText: React.Dispatch<React.SetStateAction<string | undefined>>

}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, children, setPopUpText }) => {
    const drop = (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text");
        setPopUpText(id)
        onDrop(id);
    };

    const dragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <div
                onDrop={drop}
                onDragOver={dragOver}
                className='w-full bg-zinc-100 p-5'
            >
                {children}
            </div>
        </>
    );
};

export default DropZone;
