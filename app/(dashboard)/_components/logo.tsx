import Image from "next/image";

export const Logo = ({width=200,height=200}) => {
  return (
    <Image
      height={height}
      width={width}
      alt="logo"
      src="/logo-bg.png"
    />
  )
}