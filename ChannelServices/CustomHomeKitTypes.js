'use strict'

let hap

module.exports = class CustomHomeKitTypes {
  constructor (homebridge) {
    hap = homebridge.homebridge.hap
    this.Characteristic = {}
    this.Service = {}
  }

  createCharacteristic (name, uuid, props, displayName = name) {
    this.Characteristic[name] = class extends hap.Characteristic {
      constructor () {
        super(displayName, uuid)
        this.setProps(props)
        this.value = this.getDefaultValue()
      }
    }
    this.Characteristic[name].UUID = uuid
  }

  createService (name, uuid, Characteristics, OptionalCharacteristics = []) {
    this.Service[name] = class extends hap.Service {
      constructor (displayName, subtype) {
        super(displayName, uuid, subtype)
        for (const Characteristic of Characteristics) {
          this.addCharacteristic(Characteristic)
        }
        for (const Characteristic of OptionalCharacteristics) {
          this.addOptionalCharacteristic(Characteristic)
        }
      }
    }
    this.Service[name].UUID = uuid
  }
}
