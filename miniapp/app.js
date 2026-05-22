App({
  globalData: {
    userInfo: null,
    token: null,
    apiBase: 'https://airaquas-api-gateway.jfh-099.workers.dev',
    openid: null
  },
  onLaunch() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  }
});
