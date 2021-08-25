import pinataSDK, { PinataPinResponse, PinataClient } from '@pinata/sdk'

const initPinataClient = async (): Promise<PinataClient> => {
  try {
    const pinataClient = pinataSDK(
      process.env.NEXT_PUBLIC_PINATA_KEY,
      process.env.NEXT_PUBLIC_PINATA_SECRET,
    )

    const pinataAuth = await pinataClient.testAuthentication()
    if (!pinataAuth.authenticated) {
      throw new Error('Pinata Cloud cannot authenticate')
    }
    return Promise.resolve(pinataClient)
  } catch (err) {
    throw err
  }
}

export const signContract = async <Object, PinataPinOptions>(
  body: Object,
  options?: PinataPinOptions,
): Promise<PinataPinResponse> => {
  try {
    const pinataClient = await initPinataClient()
    return pinataClient.pinJSONToIPFS(body, options)
  } catch (err) {
    console.error(err)
    setTimeout(() => {
      signContract(body, options)
    }, 60000)
  }
}
