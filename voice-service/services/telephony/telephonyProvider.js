class TelephonyProvider {
  async startCall() { throw new Error('TelephonyProvider.startCall must be implemented'); }
  async endCall() { throw new Error('TelephonyProvider.endCall must be implemented'); }
}
module.exports = TelephonyProvider;
