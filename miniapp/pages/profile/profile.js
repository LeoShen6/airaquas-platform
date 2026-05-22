// 我的
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    loggedIn: false,
    orders: [],
    loading: true
  },
  onShow() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      loggedIn: !!token,
      userInfo: userInfo || null
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    if (token) this.loadOrders();
    else this.setData({ loading: false });
  },
  loadOrders() {
    api.getOrders().then(res => {
      const list = res.data || res.orders || res.list || [];
      this.setData({ orders: Array.isArray(list) ? list : [], loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },
  goOrder(e) {
    wx.navigateTo({ url: '/pages/order/order?order_id=' + e.currentTarget.dataset.id });
  },
  logout() {
    wx.showModal({
      title: '提示', content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('openid');
          this.setData({ loggedIn: false, userInfo: null, orders: [] });
        }
      }
    });
  }
});
