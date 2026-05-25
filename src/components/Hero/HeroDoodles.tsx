import styles from './Hero.module.css'

export default function HeroDoodles() {
  return (
    <>
      <div className={`${styles.doodle} ${styles.d1}`} id="d1" data-doodle>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <path d="M35 8 C52 6,64 18,63 34 C62 52,48 64,32 63 C16 62,5 49,7 33 C9 17,22 7,35 8 Z" stroke="rgba(0,0,0,0.18)" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d2}`} id="d2" data-doodle>
        <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
          <path d="M4 14 C12 8,28 6,44 14" stroke="rgba(0,0,0,0.2)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          <path d="M38 8 L44 14 L38 20" stroke="rgba(0,0,0,0.2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d3}`} id="d3" data-doodle>
        <svg width="320" height="18" viewBox="0 0 320 18" fill="none">
          <path d="M4 10 C30 3,60 16,90 9 C120 2,150 15,180 9 C210 3,240 14,270 8 C290 4,310 11,316 9" stroke="rgba(91,78,170,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d4}`} id="d4" data-doodle>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 22 C22 18,26 15,30 18 C34 21,33 28,28 31 C22 34,15 31,13 25 C11 18,15 11,22 9 C30 7,38 12,40 20" stroke="rgba(0,0,0,0.16)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d5}`} id="d5" data-doodle>
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M4 8 C20 4,50 20,80 30 C100 38,114 44,116 52" stroke="rgba(232,96,74,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M110 50 L116 52 L112 58" stroke="rgba(232,96,74,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d6}`} id="d6" data-doodle>
        <svg width="22" height="160" viewBox="0 0 22 160" fill="none">
          <path d="M18 4 C8 12,4 36,6 80 C4 124,8 148,18 156" stroke="rgba(0,0,0,0.12)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d7}`} id="d7" data-doodle>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="2" x2="10" y2="18" stroke="rgba(0,0,0,0.18)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="2" y1="10" x2="18" y2="10" stroke="rgba(0,0,0,0.18)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="4" y1="4" x2="16" y2="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="16" y1="4" x2="4" y2="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d8}`} id="d8" data-doodle>
        <svg width="200" height="12" viewBox="0 0 200 12" fill="none">
          <path d="M2 6 C30 2,70 10,110 5 C150 0,180 8,198 5" stroke="rgba(200,168,48,0.4)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d9}`} id="d9" data-doodle>
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path d="M19 4 C28 3,35 10,34 19 C33 28,26 35,17 34 C8 33,2 26,3 17 C4 8,11 3,19 4" stroke="rgba(91,78,170,0.22)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    </>
  )
}
