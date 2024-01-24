import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import { MdAdd, MdRemove } from 'react-icons/md';

export default function Section({icon, text, content, defaultActive}) {
    const [active, setActive] = useState(defaultActive | false);
    
    const ShowContent = () => {
        if (active) {
            return content;
        }
        return null;
    }

    const ShowOrHide = () => {
        if (active) {
            return <MdRemove />
        }
        return <MdAdd />
    }

    return (
    <div className={styles.section}>
      <button className={styles.tab} style={{
        color: active ? '#fff' : '#a12222',
        borderColor: active ? '#810000' : '#0008',
        backgroundColor: active ? '#b14444' : '#e3c3c3'}} onClick={() => setActive(!active)}>
        <div className={styles['tab-left']}>
            <>{icon}</>
            <p>{text}</p>
        </div>
        <ShowOrHide />
      </button>
      <>
        <ShowContent />
      </>
    </div>
    );
  }