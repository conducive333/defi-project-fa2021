import * as cdcTypes from '@onflow/types'
import * as fcl from '@onflow/fcl'

const parseObject = (obj: Record<string, string>) => {
  const flowMeta: Record<string, string>[] = []
  const typeMeta: Record<string, unknown>[] = []
  for (const prop in obj) {
    flowMeta.push({ key: prop, value: obj[prop].toString() })
    typeMeta.push({ key: cdcTypes.String, value: cdcTypes.String })
  }
  return [flowMeta, cdcTypes.Dictionary(typeMeta)]
}

export const wrapObject = (obj: Record<string, string>) => {
  const [flowMeta, typeMeta] = parseObject(obj)
  return fcl.arg(flowMeta, typeMeta)
}

export const wrapObjects = (objs: Record<string, string>[]) => {
  const flowMetas: Record<string, string>[][] = []
  const typeMetas: unknown[][] = []
  for (const obj of objs) {
    const [flowMeta, typeMeta] = parseObject(obj)
    flowMetas.push(flowMeta)
    typeMetas.push(typeMeta)
  }
  return fcl.arg(flowMetas, cdcTypes.Array(typeMetas))
}

export const wrapObjectArray = (objs: Record<string, string>[][]) => {
  const flowMetas: Record<string, string>[][] = []
  const typeMetas: unknown[][] = []
  for (const obj of objs) {
    const [flowMeta, typeMeta] = wrapObjects(obj)
    flowMetas.push(flowMeta)
    typeMetas.push(typeMeta)
  }
  return fcl.arg(flowMetas, cdcTypes.Array(typeMetas))
}

export const wrapUInt64Array = (arr: number[]) => {
  return fcl.arg(arr, cdcTypes.Array(cdcTypes.UInt64))
}

export const wrapStringArray = (strs: string[]) => {
  return fcl.arg(strs, cdcTypes.Array(cdcTypes.String))
}

export const wrapUFix64 = (num: number) => {
  return fcl.arg(num.toFixed(8), cdcTypes.UFix64)
}

export const wrapUInt64 = (num: number) => {
  return fcl.arg(parseInt(num.toString()), cdcTypes.UInt64)
}

export const wrapContract = (contract: string) => {
  return fcl.arg(Buffer.from(contract).toString('hex'), cdcTypes.String)
}

export const wrapString = (str: string) => {
  return fcl.arg(str, cdcTypes.String)
}

export const wrapAddress = (addr: string) => {
  return fcl.arg(fcl.withPrefix(addr), cdcTypes.Address)
}
