import Image from "next/image";

export const Logo = ({ width = 200, height = 200, white = false }) => {
  return (
   <>
   <div className="hidden lg:block md:block">
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
   </div>
   <div className="lg:hidden md:hidden">
   <>
      {white
        ?
        <>
          <Image
            height={height-50}
            width={width-50}
            alt="logo"
            src="/logo-bg-white.png"
          />
        </>
        :
        <>
          <Image
            height={height-50}
            width={width-50}
            alt="logo"
            src="/logo-bg.png"
          />
        </>
      }
    </>
   </div>
   </>

  )
}