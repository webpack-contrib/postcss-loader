'use strict'

const loader = (stats) => {
  const modules = stats.compilation.modules

  return {
    err: modules.map((module) => module.errors)[1],
    src: modules.map((module) => module._source._value)[1],
    map: modules.map((module) => module._source._sourceMap)[1],
    meta: modules.map((module) => module.meta),
    warnings: modules.map((module) => module.warnings)[1]
  }
}

const loaders = (stats, i) => {
  const modules = stats.compilation.modules

  return i >= 0
    ? {
      err: modules.map((module) => module.errors)[i],
      src: modules.map((module) => module._source._value)[i],
      map: modules.map((module) => module._source._sourceMap)[i],
      meta: modules.map((module) => module.meta)[i],
      warning: modules.map((module) => module.warnings)[i]
    }
    : {
      err: modules.map((module) => module.errors),
      src: modules.map((module) => module._source._value),
      map: modules.map((module) => module._source._sourceMap),
      meta: modules.map((module) => module.meta),
      warning: modules.map((module) => module.warnings)
    }
}

const assets = (stats, i) => {
  const asset = (asset) => {
    if (/map/.test(asset)) return false
    return stats.compilation.assets[asset].sourceAndMap()
  }

  const assets = Object.keys(stats.compilation.assets)
    .map(asset)
    .filter(Boolean)

  return i >= 0 ? assets[i] : assets
}

const errors = (stats, i) => {
  const errors = stats.compilation.errors

  return i >= 0 ? errors[i] : errors
}

const warnings = (stats, i) => {
  const warnings = stats.compilation.warnings

  return i >= 0 ? warnings[i] : warnings
}

module.exports = {
  loader,
  loaders,
  assets,
  errors,
  warnings
}
