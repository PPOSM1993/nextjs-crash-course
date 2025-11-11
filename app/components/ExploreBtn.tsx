"use client";

import Link from "next/link"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CiSearch } from "react-icons/ci";


const ExploreBtn = () => {
    return (
        <>
            <Link href="#events">
                <Button
                    type="button" id="explore-btn"
                    className="mt-7 mx-auto rounded-none border-none bg-green-600 hover:bg-green-700"
                    onClick={() => console.log('CLICK')}>
                    Explore Events
                    <Image
                        src="/icons/arrow-down.svg"
                        alt="arrow-down"
                        width={24}
                        height={24}
                        className="ml-2 -mr-1"
                    />
                </Button>
            </Link>

        </>
    )
}

export default ExploreBtn;