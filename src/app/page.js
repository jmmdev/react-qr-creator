/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import {MdQrCode, MdQrCode2, MdTextFields, MdOutlineSquare, MdPalette, MdImage, MdDownload, MdFileUpload, MdSafetyCheck} from 'react-icons/md';
import {IoMdEye, IoMdEyeOff} from 'react-icons/io';
import Section from "./components/section";
import React, { useRef, useState } from "react";
import FrameSelector from "./components/frame-selector";
import "@fontsource/roboto";
import { ColorPicker } from '@vtaits/react-color-picker';
import '@vtaits/react-color-picker/index.css';
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export default function Home() {
  const url = useRef('');
  const qrElementRef = React.createRef();
  const inputRef = React.createRef();
  const [frame, setFrame] = useState(0);
  const [border, setBorder] = useState(null);
  const [foreground, setForeground] = useState('#000');
  const [background, setBackground] = useState('#fff');
  const [isGenerated, setIsGenerated] = useState(0);
  const [file, setFile] = useState(null);
  const [showFile, setShowFile] = useState(true);
  const [loadedLogo, setLoadedLogo] = useState(false);

  const GetResultQr = () => {
    if (isGenerated > 0) {
      return <QRCode format={'png'} fgColor={foreground} bgColor={background} size={'100%'} style={{aspectRatio: 1}} value={url.current} />
    }
    return <MdQrCode2 size={'100%'} />
  }

  const GetDownloadButton = () => {
    const isDisabled = file && showFile && !loadedLogo
    if (isGenerated) {
      return (
        <button disabled={isDisabled} className={styles.download} 
          style={{
            cursor: isDisabled ? 'default' : 'pointer'}} onClick={() => download()}>
          <MdDownload />
          <p>Download</p>
        </button>
      )
    }
    return null
  }

  const download = async () => {
    const canvas = await html2canvas(qrElementRef.current, {backgroundColor: null})
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'my-qr.png'
    link.href = url
    link.click()
  }

  const handleFileChange = e => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const QrLogo = () => {
    if (file && showFile) {
      return (
        <div className={styles['logo-container']}>
          <div style={{position: 'relative', width: '25%', aspectRatio: 1, display: loadedLogo ? 'block' : 'none'}}>
            <img onLoad={() => {
                  setTimeout(() => {
                    setLoadedLogo(true)
                  }, 700);
                  }} 
                  style={{
                    width: '100%',
                    objectFit: "contain",
                    userSelect: 'none',
                  }}
                  src={URL.createObjectURL(file)} alt="XD" />
          </div>
          <div className={styles['loader-container']} style={{display: loadedLogo ? 'none' : 'block'}}>
              <p>Please wait...</p>
            </div>
        </div>
      )
    }
    return null
  }

  const GetShowIcon = () => {
    if (file) {
      if (showFile) {
        return <IoMdEyeOff />
      } else {
        return <IoMdEye />
      }
    }
  }

  const GetFileFeatures = () => {
    if (file) {
      return (
        <>
          <p className={styles.file}>{file.name}</p>
          <button className={styles.show} onClick={() => setShowFile(!showFile)}>
            <GetShowIcon />
          </button>
        </>
      )
    }
    return null
  }

  return (
    <main className={styles.main}>
      <div className={styles['main-container']}>
        <div className={styles.header}>
          <MdQrCode />
          <p>QR Creator</p>
        </div>
        <div className={styles.generator}>
          <div className={styles.options}>
            <Section icon={<MdTextFields />} text="URL / Text" defaultActive={true} content={
              <div className={styles['input-container']}>
                <input className={styles.input} defaultValue={url.current} maxLength={140} placeholder={'https://react-qr-creator.vercel.app'} onChange={e => url.current = e.target.value}/>
                <button onClick={() => {
                    if (url.current.length > 0) {
                      setIsGenerated(isGenerated + 1)
                    }
                  }}>
                    <p>Generate</p>
                  </button>
              </div>
            } />
            <Section icon={<MdOutlineSquare />} text="Design" content={
              <FrameSelector frame={frame} setFrame={setFrame} setBorder={setBorder} />
            } />
            <Section icon={<MdPalette />} text="Colors" content={
              <div>
                <div className={styles['colorpicker-group-container']}>
                  <div className={styles['colorpicker-container']}>
                    <p>Foreground color</p>
                    <div className={styles['colorpicker-bg']}>
                      <ColorPicker
                      saturationWidth={250}
                      saturationHeight={250}
                      value={foreground} onDrag={color => {
                        if (loadedLogo)
                          setLoadedLogo(false)
                        setForeground(color)
                      }} />
                    </div>
                  </div>
                  <div className={styles['colorpicker-container']}>
                    <p>Background color</p>
                    <div className={styles['colorpicker-bg']}>
                      <ColorPicker
                      saturationWidth={250}
                      saturationHeight={250}
                      value={background} onDrag={color => {
                        if (loadedLogo)
                          setLoadedLogo(false)
                        setBackground(color)
                      }} />
                    </div>
                  </div>
                </div>
                <p className={styles.warning}>
                  * Notice: for a QR code to be readable by most scanning applications, the foreground color must be darker than the background color. Additionally, there should be sufficient contrast between both colors for proper functionality.
                </p>
              </div>
            } />
            <Section icon={<MdImage />} text="Custom logo" content={
              <div className={styles['file-container']}>
                <input style={{display: 'none'}} ref={inputRef} type="file" onChange={e => handleFileChange(e)} />
                <button className={styles.upload} onClick={() => inputRef.current.click()}>
                  <MdFileUpload />
                  <p>Upload a file</p>
                </button>
                <GetFileFeatures />
              </div>
            }/>
          </div>
          <div className={styles.preview}>
            <div ref={qrElementRef} className={styles['qr-container']}
            style={{
                  color: foreground,
                  backgroundColor: background,
                  borderWidth: 8,
                  borderColor: border ? foreground : 'transparent',
                  borderRadius: border && border.includes('rounded') ? 16 : 0,
                  borderStyle: border && border.includes('dashed') ? 'dashed' : 
                               border && border.includes('solid') ? 'solid' : 'solid', 
                  }} >
                  <GetResultQr/>
                  <QrLogo />
            </div>
            <GetDownloadButton />
          </div>
        </div>
      </div>
    </main>
  );
}
