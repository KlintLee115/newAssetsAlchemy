import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Session } from "next-auth"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export class URL_Endpoints {
    static BACKEND_URL = process.env.NODE_ENV === "development" ? 'http://localhost:3001' : 'https://pricesbackend.azurewebsites.net';
    static AUTHENTICATION_URL = process.env.NODE_ENV === "development" ? 'http://localhost:3000/api/auth/signin' : ''
}

export type EstateType = {
    id: number,
    maintenence_cost: string,
    name: string,
    price: string,
    rpm: string,
    credit: string
}

export type StockType = {
    id: number,
    name: string,
    price: string,
    rpm: string,
    credit: number
}

type UserPersonalInfoType = {
    email: string,
    name: string,
    image: string
}

type TOrUndefined<T> = T | undefined

enum CookieKeynames {
    Username = "username",
    Email = "email",
    Image = "image",
}

export class SessionInfo {

    public static document: Document

    private static getCookieValue(cookieName: string): TOrUndefined<String> {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const userCookie = cookies.find(cookie => cookie.startsWith(`${cookieName}=`));

        return userCookie ? userCookie.split('=')[1] : undefined;
    }

    public static get<T extends keyof typeof CookieKeynames>(cookieName: T): TOrUndefined<String> {
        return SessionInfo.getCookieValue(CookieKeynames[cookieName])
    }

    public static set session(session: Session) {

        const user = session.user as UserPersonalInfoType

        if (!user || !user.email || !user.name || !user.image) {
            throw new Error("Invalid user personal information");
        }

        const email = user.email
        const username = user.name
        const image = user.image

        document.cookie = `${CookieKeynames.Email} = ${email} ; ${CookieKeynames.Username} = ${username} ; ${CookieKeynames.Image} = ${image}`;
    }
}