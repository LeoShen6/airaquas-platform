// 产品列表
const api = require('../../utils/api');

Page({
  data: {
    products: [],
    categories: ['全部', 'shampoo', 'conditioner', 'spray', 'cleanser'],
    categoryNames: { '全部': '全部', 'shampoo': '洗发', 'conditioner': '护发', 'spray': '喷雾', 'cleanser': '洁面' },
    currentCategory: '全部',
    loading: true
  },
  onLoad() {
    this.loadProducts();
  },
  loadProducts() {
    api.getProducts().then(res => {
      const list = res.data || res.products || res || [];
      this.setData({ products: Array.isArray(list) ? list : [], loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  filterCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat, loading: true });
    // Filter locally or re-fetch
    if (cat === '全部') {
      this.loadProducts();
    } else {
      api.getProducts().then(res => {
        const list = res.data || res.products || res || [];
        const filtered = (Array.isArray(list) ? list : []).filter(p => p.category === cat);
        this.setData({ products: filtered, loading: false });
      });
    }
  },
  goProduct(e) {
    wx.navigateTo({ url: '/pages/product/product?id=' + e.currentTarget.dataset.id });
  }
});
