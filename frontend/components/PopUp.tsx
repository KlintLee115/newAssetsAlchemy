"use client"

import { EstateType, SessionInfo, StockType } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export type PopUpInfoType = {
    isOn: boolean,
    text?: string,
}

type PopUpPropsType = {
    realEstateInfo?: EstateType[],
    stocksInfo?: StockType[],
    text: string, addItem: (value: React.SetStateAction<string[]>) => void, isOverlayOn: boolean,
    setIsOverlayOn: Dispatch<SetStateAction<PopUpInfoType>>,
    debt: number,
    creditScore: number,
    coins: number,
    setRpm: React.Dispatch<React.SetStateAction<number>>,
    setCoins: React.Dispatch<React.SetStateAction<number>>,
    setDebt: React.Dispatch<React.SetStateAction<number>>
}


export default function PopUp({ realEstateInfo, stocksInfo, text, isOverlayOn, setIsOverlayOn, addItem, setRpm, setDebt, debt, creditScore, coins, setCoins }: PopUpPropsType) {

    const cancelOverlay = () => setIsOverlayOn({ isOn: false })

    let addRpmAmt = 0;
    let requiredCoins = 0;
    let requiredDebt = 0;
    let foundItem = false

    if (realEstateInfo) {
        for (const info of realEstateInfo) {
            if (info.name === text) {
                addRpmAmt = Number.parseInt(info.rpm)
                requiredCoins = Number.parseInt(info.price)
                addRpmAmt = Number.parseInt(info.rpm)
                foundItem = true
                requiredDebt = Number.parseInt(info.credit)
                break
            }
        }
    }


    if (!foundItem && stocksInfo) {
        for (const info of stocksInfo) {
            if (info.name === text) {
                addRpmAmt = Number.parseInt(info.rpm)
                requiredCoins = Number.parseInt(info.price)
                addRpmAmt = Number.parseInt(info.rpm)
                requiredDebt = info.credit
                break
            }
        }
    }

    function postUpdate() {
        fetch("http://localhost:3001/buyItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text, email: SessionInfo.get("Email")
            })
        })
    }

    const useCoins = () => {

        if (coins >= requiredCoins) {
            addItem((prevItems) => [...prevItems, text]);
            setRpm(rpm => rpm + addRpmAmt)

            postUpdate()
            setCoins(coins - requiredCoins)
        }
        cancelOverlay()
    }

    const useLoan = () => {

        if (creditScore > 350) {
            addItem((prevItems) => [...prevItems, text])
            setRpm(rpm => rpm + addRpmAmt)
            setDebt(debt => debt + requiredDebt)

            postUpdate()
        }
        cancelOverlay()
    }

    return (
        <div className={`bg-white z-10 h-fit py-[5vh]
            fixed inset-0 top-[10vh] shadow-black shadow-2xl
            mx-auto w-fit px-[5vw]  transition-all ${isOverlayOn ? 'scale-100' : 'scale-0'}`}>
            <p>How would you like to buy it?</p>
            <div className="flex justify-between">
                <button className={`${coins >= requiredCoins ? "bg-yellow-300 px-5" : "bg-gray-500"}`} disabled={coins < requiredCoins} onClick={useCoins}>Coins</button>
                <button onClick={useLoan} className="bg-green-400 px-5">Get a loan</button>
            </div>
            <button className="bg-red-400 px-5 float-end mt-3" onClick={cancelOverlay}>Cancel</button>
        </div>
    )
}
