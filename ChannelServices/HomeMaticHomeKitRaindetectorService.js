'use strict'

var HomeKitGenericService = require('./HomeKitGenericService.js').HomeKitGenericService
var util = require('util')

function HomeMaticHomeKitRaindetectorService (log, platform, id, name, type, adress, special, cfg, Service, Characteristic) {
  HomeMaticHomeKitRaindetectorService.super_.apply(this, arguments)
}

util.inherits(HomeMaticHomeKitRaindetectorService, HomeKitGenericService)

HomeMaticHomeKitRaindetectorService.prototype.propagateServices = function (homebridge, Service, Characteristic) {
  var uuid = homebridge.uuid

  Characteristic.IsRainingCharacteristic = class extends Characteristic {
    constructor () {
      var charUUID = uuid.generate('HomeMatic:customchar:IsRainingCharacteristic')
      super('Regen', charUUID)
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      })
      this.value = this.getDefaultValue()
    }
  }

  Service.IsRainingService = class extends Service {
    constructor (displayName, subtype) {
      var servUUID = uuid.generate('HomeMatic:customchar:IsRainingService')
      super(displayName, servUUID, subtype)
      this.addCharacteristic(Characteristic.IsRainingCharacteristic)
    }
  }
}

HomeMaticHomeKitRaindetectorService.prototype.createDeviceService = function (Service, Characteristic) {
  var that = this
  var rain = new Service['IsRainingService'](this.name)
  this.services.push(rain)
  var crain = rain.getCharacteristic(Characteristic.IsRainingCharacteristic)
    .on('get', function (callback) {
      that.query('STATE', function (value) {
        if (callback) callback(null, value)
      })
    })

  this.currentStateCharacteristic['RAINING'] = crain
  crain.eventEnabled = true
}

module.exports = HomeMaticHomeKitRaindetectorService
