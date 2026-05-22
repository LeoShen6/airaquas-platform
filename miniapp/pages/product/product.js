// 产品详情
const api = require('../../utils/api');

Page({
  data: {
    product: null,
    quantity: 1,
    loading: true
  },
  onLoad(options) {
    if (options.id) {
      this.loadProduct(options.id);
    }
  },
  loadProduct(id) {
    api.getProduct(id).then(res => {
      const p = res.data || res.product || res;
      this.setData({ product: p, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '产品不存在', icon: 'none' });
    });
  },
  decrease() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },
  increase() {
    if (this.data.quantity < 99) {
      this.setData({ quantity: this.data.quantity + 1 });
    }
  },
  addToCart() {
    const p = this.data.product;
    if (!p) return;
    api.addToCart(p.id, this.data.quantity).then(() => {
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    }).catch(() => {
      wx.showToast({ title: '加入失败，请重试', icon: 'none' });
    });
  },
  buyNow() {
    const p = this.data.product;
    if (!p) return;
    wx.setStorageSync('buyNow', {
      id: p.id, name: p.name, price: p.price,
      quantity: this.data.quantity, image_url: p.image_url
    });
    // Check login first
    const token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({ url: '/pages/order/order?type=buyNow' });
    } else {
      wx.navigateTo({ url: '/pages/login/login?redirect=order' });
    }
  }
});
