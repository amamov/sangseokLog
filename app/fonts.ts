import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'

// Serif for body & headlines
export const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
})

// Sans for UI chrome and small labels
export const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
})
