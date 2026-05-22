// 下单页
const api = require('../../utils/api');

Page({
  data: {
    orderType: '',
    items: [],
    total: 0,
    address: '请选择收货地址',
    loading: true
  },
  onLoad(options) {
    const type = options.type || 'cart';
    this.setData({ orderType: type });
    if (type === 'buyNow') {
      const item = wx.getStorageSync('buyNow');
      if (item) {
        this.setData({
          items: [item],
          total: item.price * item.quantity,
          loading: false
        });
      }
    } else {
      // Cart checkout
      const checkoutItems = wx.getStorageSync('checkoutItems') || [];
      if (checkoutItems.length > 0) {
        api.getCart().then(res => {
          const cart = res.data || res.items || res.cart || [];
          const selected = (Array.isArray(cart) ? cart : []).filter(i =>
            checkoutItems.some(c => c.id === (i.product_id || i.productId))
          );
          let total = 0;
          selected.forEach(i => { total += (i.unit_price || i.price) * (i.quantity || 1); });
          this.setData({ items: selected, total, loading: false });
        });
      } else {
        this.setData({ loading: false });
      }
    }
  },
  submitOrder() {
    wx.showLoading({ title: '提交中...' });
    const orderItems = this.data.items.map(i => ({
      product_id: i.id || i.product_id || i.productId,
      quantity: i.quantity
    }));
    api.createOrder({ items: orderItems }).then(res => {
      wx.hideLoading();
      const orderId = res.order_id || res.id;
      wx.showModal({
        title: '下单成功',
        content: '订单已提交',
        success: () => {
          wx.removeStorageSync('buyNow');
          wx.removeStorageSync('checkoutItems');
          wx.navigateTo({ url: '/pages/profile/profile' });
        }
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '下单失败，请重试', icon: 'none' });
    });
  }
});
