import styles from "../page.module.css";

export default function Frame ({value}) {
    const isRounded = value.includes('rounded')
    const isDashed = value.includes('dashed')

    const GetValue = () => {
        if (value === 'none') {
            return (
                <div className={styles['design-none']} />
            )
        }
        return null
    }

    return (
        <div className={styles['design-content']} style={{borderWidth: value === "none" ? 0 : 2, borderRadius: isRounded ? 8 : 0, borderStyle: isDashed ? 'dashed' : 'solid'}}>
            <GetValue />
        </div>
    )
} 