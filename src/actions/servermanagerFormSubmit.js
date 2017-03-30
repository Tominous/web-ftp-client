'use strict'

const extend = require('extend')
const path = require('path')
const db = require(path.join(__dirname, '../db'))
const Server = require(path.join(__dirname, '../server'))
const FtpServer = require(path.join(__dirname, '../ftpServer'))

const action = {}

/**
 * Require user
 * @type {boolean}
 */
action.requireUser = true

/**
 * Execute the action
 * @param {WebSocketUser} user
 * @param {*} message
 * @param {function} callback
 */
action.execute = function (user, message, callback) {
  const formData = message.formData
  if (formData.host && formData.port) {
    let storedData = {}
    if (message.id) {
      storedData = Server.get(message.id).getServerData()
    } else {
      storedData = {
        'id': db.getNextId()
      }
    }
    // simply merging data from form into data object
    extend(true, storedData, formData)
    Server.get(storedData.id).setServerData(storedData)
    if (typeof FtpServer.instances[storedData.id] !== 'undefined') {
      FtpServer.instances[storedData.id].disconnect()
    }
  }
  callback()
}

module.exports = action
