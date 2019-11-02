
export default {
  connect: function () {
    console.log('[socket] socket connected')
  },
  userMessage: function (message) {
    console.log(`[socket] server message: ${message}`)
  },
  setQrcode: function (qrcode) {
    console.log(`[socket] server qrcode: ${qrcode}`)
  },
  setQstatus: function (qstatus) {
    console.log(`[socket] server qstatus: ${qstatus}`)
  },
  setToken: function (token) {
    console.log(`[socket] server token: ${token}`)
  },
}
