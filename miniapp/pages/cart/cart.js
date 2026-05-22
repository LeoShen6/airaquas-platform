// 购物车
const api = require('../../utils/api');

Page({
  data: {
    cartItems: [],
    selectedIds: [],
    totalPrice: 0,
    loading: true,
    editing: false
  },
  onShow() {
    this.loadCart();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },
  loadCart() {
    api.getCart().then(res => {
      const items = res.data || res.items || res.cart || [];
      this.setData({
        cartItems: Array.isArray(items) ? items : [],
        loading: false
      });
      this.calcTotal();
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    let selected = [...this.data.selectedIds];
    const idx = selected.indexOf(id);
    if (idx > -1) { selected.splice(idx, 1); }
    else { selected.push(id); }
    this.setData({ selectedIds: selected });
    this.calcTotal();
  },
  toggleAll() {
    const all = this.data.cartItems.map(i => i.id);
    const allSelected = this.data.selectedIds.length === all.length;
    this.setData({ selectedIds: allSelected ? [] : all });
    this.calcTotal();
  },
  calcTotal() {
    let total = 0;
    this.data.cartItems.forEach(item => {
      if (this.data.selectedIds.includes(item.id)) {
        total += (item.unit_price || item.price || 0) * (item.quantity || 1);
      }
    });
    this.setData({ totalPrice: total });
  },
  changeQty(e) {
    const { id, delta } = e.currentTarget.dataset;
    const items = [...this.data.cartItems];
    const idx = items.findIndex(i => i.id === id);
    if (idx > -1) {
      const newQty = (items[idx].quantity || 1) + delta;
      if (newQty < 1 || newQty > 99) return;
      items[idx].quantity = newQty;
      this.setData({ cartItems: items });
      api.updateCart(id, newQty);
      this.calcTotal();
    }
  },
  removeItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          api.removeFromCart(id).then(() => this.loadCart());
        }
      }
    });
  },
  checkout() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login?redirect=cart' });
      return;
    }
    const items = this.data.cartItems
      .filter(i => this.data.selectedIds.includes(i.id))
      .map(i => ({ id: i.product_id || i.productId, quantity: i.quantity }));
    wx.setStorageSync('checkoutItems', items);
    wx.navigateTo({ url: '/pages/order/order?type=cart' });
  },
  toggleEdit() {
    this.setData({ editing: !this.data.editing });
  }
});
