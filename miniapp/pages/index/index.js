// 首页
const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    products: [],
    scalpTypes: ['油性头皮', '干性头皮', '敏感性头皮', '健康头皮'],
    bannerHeight: 200,
    loading: true
  },
  onLoad() {
    this.loadProducts();
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },
  loadProducts() {
    api.getProducts().then(res => {
      const list = res.data || res.products || res || [];
      this.setData({ products: Array.isArray(list) ? list : [], loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  goProducts() {
    wx.navigateTo({ url: '/pages/products/products' });
  },
  goProduct(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/product/product?id=' + id });
  },
  goScalpMatch() {
    wx.navigateTo({ url: '/pages/diagnosis/diagnosis' });
  },
  goAllProducts() {
    wx.navigateTo({ url: '/pages/products/products' });
  }
});
