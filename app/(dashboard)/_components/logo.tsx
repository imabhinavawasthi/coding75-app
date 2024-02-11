import Image from "next/image";

export const Logo = ({ width = 200, height = 200, white = false }) => {
  return (
    <>
      {white
        ?
        <>
          <Image
            height={height}
            width={width}
            alt="logo"
            src="/logo-bg-white.png"
          />
        </>
        :
        <>
          <Image
            height={height}
            width={width}
            alt="logo"
            src="/logo-bg.png"
          />
        </>
      }
    </>

  )
}