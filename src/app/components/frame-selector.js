import { useState } from 'react';

export default function FrameSelector ({setBorder}) {
    const [selected, setSelected] = useState(0);

    const designList = ['none', 'solid', 'solid-rounded', 'dashed', 'dashed-rounded']

    function selectBorder(index) {
        setSelected(index);
        if (index > 0) {
            setBorder(designList[index]);
            return;
        }
        setBorder(null);
    }

    return (
        <>
            {designList.map((d, index) => {
                return (
                    <button key={d} className={`w-16 p-1.5 aspect-square bg-slate-400 ${selected === index ? "ring-4 ring-sky-500" : "hover:ring-4 ring-slate-300"}`}
                    onClick={() => selectBorder(index)}>
                        <div className={`relative w-full aspect-square ${d !== 'none' ? "border-4 border-slate-900" : ""} ${d.includes('rounded') ? "rounded-lg" : ""} ${d.includes('dashed') ? "border-dashed" : ""}`}>
                            {d === "none" &&
                                <>
                                    <div className="absolute top-0 right-1/2 rotate-45 w-0.5 h-full bg-slate-200" />
                                    <div className="absolute top-0 left-1/2 -rotate-45 w-0.5 h-full bg-slate-200" />
                                </>
                            }
                        </div>
                    </button>
                )
            })}
        </>
    )
}