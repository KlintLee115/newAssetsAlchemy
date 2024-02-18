"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { signIn, signOut, useSession } from 'next-auth/react';
import { EstateType, SessionInfo, StockType } from "@/lib/utils";
import dynamic from "next/dynamic";
import DraggableElement from "@/components/DraggableElement";
import DropZone from "@/components/DropZone";
import DragAndDropContainer from "@/components/DroppedItem";
import PopUp, { PopUpInfoType } from "@/components/PopUp";

const Page = () => {
    const [droppedItems, setDroppedItems] = useState<string[]>([]);
    const [popUpText, setPopUpText] = useState<string>();
    const [realEstateInfo, setRealEstateInfo] = useState<EstateType[]>()
    const [stocksInfo, setStocksInfo] = useState<StockType[]>()
    const [debt, setDebt] = useState<number>(0)
    const [creditScore, setCreditScore] = useState<number>(500)
    const [coins, setCoins] = useState<number>(10000)
    const [rpm, setRpm] = useState<number>(0)

    const { data: session } = useSession()

    if (session?.user && !SessionInfo.get("Email")) {
        SessionInfo.session = session
    }

    const [isOverlayOn, setIsOverlayOn] = useState<PopUpInfoType>({
        isOn: false,
    });

    const handleDrop = (text: string) => {
        setIsOverlayOn({ isOn: true, text: text });
    };

    useEffect(() => {
        // Increase coins every second based on rpm
        const intervalId = setInterval(() => {
            setCoins(prevCoins => prevCoins + rpm);
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [rpm]);

    useEffect(() => {
        // Increase coins every second based on rpm
        const intervalId = setInterval(() => {
            setCreditScore(score => score - (debt * 0.5));
        }, 10000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [debt]);

    useEffect(() => {

        async function setRealEstate() {
            const response = await fetch('http://localhost:3001/realEstates')
            setRealEstateInfo(await response.json())
        }

        async function setStocks() {
            const response = await fetch('http://localhost:3001/stocks')
            setStocksInfo(await response.json())
        }

        Promise.all([setRealEstate(), setStocks()])

        if (!SessionInfo.get("Email") && session?.user) SessionInfo.session = session
    }, [])

    return (
        <>
            <PopUp
                stocksInfo={stocksInfo}
                realEstateInfo={realEstateInfo}
                coins={coins}
                creditScore={creditScore}
                debt={debt}
                setRpm={setRpm}
                setCoins={setCoins}
                setDebt={setDebt}
                addItem={setDroppedItems}
                text={popUpText as string}
                isOverlayOn={isOverlayOn.isOn}
                setIsOverlayOn={setIsOverlayOn}
            />
            <div
                onClick={() => setIsOverlayOn({ isOn: false })}
                className={`flex w-full ${isOverlayOn.isOn ? "opacity-25" : "opacity-100"
                    }`}
            >
                <div className={`w-full flex flex-grow justify-start`}>
                    {/* Container for DropZone and Tabs */}
                    <div className='px-10'>
                        {/* Header container */}
                        <header className='flex justify-between items-center w-full gap-20 p-5'>
                            {/* Centered header content */}
                            <div className='flex gap-20'>
                                <div className='flex flex-col items-center gap-1 text-sm'>
                                    <h2 className='font-semibold'>Balance</h2>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={`coin.svg`}
                                            alt='coin'
                                            width={18}
                                            height={18}
                                        />
                                        <span className='font-medium'>
                                            {coins}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-1 text-sm'>
                                    <div className='flex gap-1 items-end'>
                                        <h2 className='font-semibold'>
                                            Credit Amount{" "}
                                        </h2>
                                        <span className='text-[10px] font-medium'>
                                            (20% interest){" "}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-medium'>{debt}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-1 text-sm'>
                                    <h2 className='font-semibold'>
                                        {" "}
                                        Coins per min{" "}
                                    </h2>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={`coin.svg`}
                                            alt='coin'
                                            width={18}
                                            height={18}
                                        />
                                        <span className='font-medium'>{rpm}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-1 text-sm'>
                                    <h2 className='font-semibold'>
                                        {" "}
                                        Credit Score{" "}
                                    </h2>
                                    <div className='flex items-center gap-2 font-medium'>
                                        {creditScore}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {SessionInfo.get("Email") ? SessionInfo.get("Email") : <p
                                    className="cursor-pointer"
                                    onClick={() => signIn()}
                                >Sign in</p>}
                            </div>
                        </header>
                        <DropZone setPopUpText={setPopUpText} onDrop={handleDrop}>
                            <DragAndDropContainer droppedItems={droppedItems} />
                        </DropZone>
                    </div>
                </div>
                <div className='w-1/3 p-4'>
                    {/* Adjusted width for the tabs container */}
                    <Tabs defaultValue='Real Estates'>
                        <TabsList>
                            {/* <TabsTrigger value='all'>Owned</TabsTrigger> */}
                            <TabsTrigger value='Real Estates'>
                                Real Estates
                            </TabsTrigger>
                            <TabsTrigger value='Stocks'>Stocks</TabsTrigger>
                        </TabsList>

                        <TabsContent value='Real Estates'>
                            <div>High returns with maintenance fees</div>
                            {realEstateInfo ? realEstateInfo.map(info => {
                                return <DraggableElement
                                    key={info.id}
                                    id={info.name}
                                    name={info.name}
                                    price={Number.parseInt(info.price)}
                                    credit={Number.parseFloat(info.credit)}
                                />
                            }) : <div></div>
                            }
                        </TabsContent>
                        <TabsContent value='Stocks'>
                            <div>High risk with less capital</div>
                            {stocksInfo ? stocksInfo.map(info => {
                                return <DraggableElement
                                    key={info.id}
                                    id={info.name}
                                    name={info.name}
                                    price={Number.parseInt(info.price)}
                                    credit={info.credit}
                                />
                            }) : <div></div>
                            }
                        </TabsContent>
                        <TabsContent value='cross'>
                            Placeholder content for Cross-category
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default dynamic(() => Promise.resolve(Page), {
    ssr: false,
})
