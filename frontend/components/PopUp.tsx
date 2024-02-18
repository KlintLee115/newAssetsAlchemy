"use client"

import { SessionInfo } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export type PopUpInfoType = {
    isOn: boolean,
    text?: string,
}

type PopUpPropsType = {
    text: string, addItem: (value: React.SetStateAction<string[]>) => void, isOverlayOn: boolean,
    setIsOverlayOn: Dispatch<SetStateAction<PopUpInfoType>>,
    debt: number,
    creditScore: number,
    coins: number,
    setRpm: React.Dispatch<React.SetStateAction<number>>,
    setCoins: React.Dispatch<React.SetStateAction<number>>,
    setDebt: React.Dispatch<React.SetStateAction<number>>
}


export default function PopUp({ text, isOverlayOn, setIsOverlayOn, addItem, setRpm, setDebt, debt, creditScore, coins, setCoins }: PopUpPropsType) {

    const cancelOverlay = () => setIsOverlayOn({ isOn: false })

    let addRpmAmt = 0;
    let requiredCoins = 0;
    let requiredDebt = 0;

    switch (text) {
        case 'House': {
            addRpmAmt = 20
            requiredCoins = 4000
            requiredDebt = 30
            break
        }
        case 'Mansion': {
            addRpmAmt = 40
            requiredCoins = 7000
            requiredDebt = 40
            break
        }
        case 'Apartment': {
            addRpmAmt = 20
            requiredCoins = 3500
            requiredDebt = 20
            break
        }
        case 'Hotel': {
            addRpmAmt = 40
            requiredCoins = 6000
            requiredDebt = 50
            break
        }
        case 'Apple': {
            addRpmAmt = 20
            requiredCoins = 150
            requiredDebt = 170
            break
        }
        case 'Microsoft': {
            addRpmAmt = 40
            requiredCoins = 170
            requiredDebt = 200
            break
        }
        case 'Google': {
            addRpmAmt = 20
            requiredCoins = 200
            requiredDebt = 250
            break
        }
        case 'Meta': {
            addRpmAmt = 40
            requiredCoins = 240
            requiredDebt = 280
            break
        }
    }

    const useCoins = () => {
        addItem((prevItems) => [...prevItems, text]);
        setRpm(rpm => rpm + addRpmAmt)

        fetch("http://localhost:3001/buyItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text, email: SessionInfo.get("Email")
            })
        })
        setCoins(coins - requiredCoins)
        cancelOverlay()
    }

    const useLoan = () => {

        if (creditScore > 350) {
            addItem((prevItems) => [...prevItems, text])
            setRpm(rpm => rpm + addRpmAmt)
            setDebt(debt => debt + requiredDebt)

            fetch("http://localhost:3001/buyItem", {
                method: "POST",
                body: JSON.stringify({
                    text: text, email: SessionInfo.get("Email")
                })
            })
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
