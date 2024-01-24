import styles from "../page.module.css";
import Frame from "./frame";

export default function FrameSelector ({frame, setFrame, setBorder}) {
    const designList = ['none', 'solid', 'solid-rounded', 'dashed', 'dashed-rounded']

    return (
        <div className={styles['design-gallery']}>
            {designList.map((d, index) => {
                return (
                    <button key={d} className={styles.design} 
                        style={{
                            boxShadow: frame === index ? '0 0 0 3px #b14444' : 'none',
                        }} onClick={() => { 
                            setFrame(index)
                            setBorder(d !== 'none' ? d : null)
                        }}>
                        <Frame value={d} />
                    </button>
                )
            })}
        </div>
    )
}