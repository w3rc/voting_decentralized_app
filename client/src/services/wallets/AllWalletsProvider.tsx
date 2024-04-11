import { ReactNode } from "react"
import { BladeContextProvider } from "../../contexts/BladeContext"
import { MetamaskContextProvider } from "../../contexts/MetamaskContext"
// import { BladeClient } from "./blade/bladeClient"
import { MetaMaskClient } from "./metamask/metamaskClient"

export const AllWalletsProvider = (props: {
  children: ReactNode | undefined
}) => {
  return (
    <BladeContextProvider>
      <MetamaskContextProvider>
        {/* <BladeClient /> */}
        <MetaMaskClient />
        {props.children}
      </MetamaskContextProvider>
    </BladeContextProvider>
  )
}
