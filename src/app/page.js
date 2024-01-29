/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import {MdQrCode, MdQrCode2, MdTextFields, MdOutlineSquare, MdPalette, MdImage, MdDownload, MdFileUpload, MdCheck} from 'react-icons/md';
import {IoMdEye, IoMdEyeOff} from 'react-icons/io';
import Section from "./components/section";
import React, { useRef, useState } from "react";
import FrameSelector from "./components/frame-selector";
import "@fontsource/roboto";
import html2canvas from "html2canvas";
import DomToImage from "dom-to-image";
import QRCode from "react-qr-code";
import { HslStringColorPicker } from "react-colorful";

export default function Home() {
  const url = useRef('');
  const qrElementRef = React.createRef();
  const inputRef = React.createRef();
  const [frame, setFrame] = useState(0);
  const [border, setBorder] = useState(null);
  const fgValue = useRef('hsl(0, 0%, 0%)')
  const [foreground, setForeground] = useState(fgValue.current);
  const bgValue = useRef('hsl(0, 0%, 100%)')
  const [background, setBackground] = useState(bgValue.current);
  const [isGenerated, setIsGenerated] = useState(0);
  const [file, setFile] = useState(null);
  const [showFile, setShowFile] = useState(true);
  const [loadedLogo, setLoadedLogo] = useState(false);

  const GetResultQr = () => {
    if (isGenerated > 0) {
      return <QRCode level="H" format={'png'} fgColor={getActualColor(foreground, 'fg')} bgColor={getActualColor(background, 'bg')} size={'100%'} style={{aspectRatio: 1}} value={url.current} />
    }
    return <MdQrCode2 size={'100%'} />
  }

  const GetDownloadButton = () => {
    const isDisabled = !(isGenerated > 0) || file && showFile && !loadedLogo
  
    return (
      <button disabled={isDisabled} className={styles.download} 
        style={{
          cursor: isDisabled ? 'default' : 'pointer'}} onClick={() => isDisabled ? {} : download()}>
        <MdDownload />
        <p>Download</p>
      </button>
    )
  }

  const download = async () => {
    DomToImage.toBlob(qrElementRef.current)
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'my-qr.png'
        link.href = url
        link.click()
      });
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
          <div style={{position: 'relative', width: '20%', aspectRatio: 1, display: loadedLogo ? 'block' : 'none'}}>
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

  const getActualColor = (color, layer) => {
    if (color !== 'hsl(0, 0%, 0%)' && color !== 'hsl(0, 0%, 100%)') {
      const colorValues = ((color.replace('hsl(', '')).replace(')', '')).split(', ')
      const hue = colorValues[0];

      if (layer === 'fg')
        return `hsl(${hue}, 50%, 25%)`
      else
        return `hsl(${hue}, 50%, 75%)`
    }
    return color
  }

  const handleUpEvents = () => {
    if (foreground !== fgValue.current) {
      setLoadedLogo(false)
      setForeground(fgValue.current)
    }
    if (background !== bgValue.current) {
      setLoadedLogo(false)
      setBackground(bgValue.current)
    }
  }

  return (
    <main className={styles.main} 
      onMouseUp={() => handleUpEvents()}
      onTouchEnd={() => handleUpEvents()}>
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
              <div className={styles['colorpicker-group-container']}>
                <div className={styles['colorpicker-container']}>
                  <p>Foreground color</p>
                    <div className={styles['colorpicker-options']}>
                      <button 
                        onClick={() => {
                          setLoadedLogo(false)
                          fgValue.current = 'hsl(0, 0%, 0%)'
                          setForeground(fgValue.current)
                        }}
                        className={styles['default-color']}
                        style={{
                          backgroundColor: '#000',
                          boxShadow: foreground === 'hsl(0, 0%, 0%)' ? '0 0 0 2px #fffc' : 'none'}}>
                        <MdCheck size={'100%'} color="#fff" style={{display: foreground === 'hsl(0, 0%, 0%)' ? 'block' : 'none'}} />
                      </button>
                      <div style={{width: '100%', position: 'relative'}}>
                        <HslStringColorPicker className={styles['react-colorful']} color={foreground} onChange={color => fgValue.current = color} />
                        <div style={{width: '100%', height: '100%', backgroundColor:'#000', borderRadius: 3, top: 0, left: 0, position: 'absolute'}}/>
                      </div>
                    </div>
                </div>
                <div className={styles['colorpicker-container']}>
                  <p>Background color</p>
                  <div className={styles['colorpicker-options']}>
                    <button
                      onClick={() => {
                        setLoadedLogo(false)
                        bgValue.current = 'hsl(0, 0%, 100%)'
                        setBackground(bgValue.current)
                      }}
                      className={styles['default-color']} 
                      style={{
                        backgroundColor: '#fff',
                        boxShadow: background === 'hsl(0, 0%, 100%)' ? '0 0 0 2px #000c' : 'none'}}>
                      <MdCheck size={'100%'} color="#000" style={{display: background === 'hsl(0, 0%, 100%)' ? 'block' : 'none'}} />
                    </button>
                    <div style={{width: '100%', position: 'relative'}}>
                      <HslStringColorPicker className={styles['react-colorful']} color={background} onChange={color => bgValue.current = color} />
                      <div style={{width: '100%', height: '100%', backgroundColor:'#fff', borderRadius: 3, top: 0, left: 0, position: 'absolute'}}/>
                    </div>
                  </div>
                </div>
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
                  color: getActualColor(foreground, 'fg'),
                  backgroundColor: getActualColor(background, 'bg'),
                  borderWidth: 8,
                  borderColor: border ? getActualColor(foreground, 'fg') : 'transparent',
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
