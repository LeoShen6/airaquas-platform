const API_BASE = 'https://airaquas-api-gateway.jfh-099.workers.dev';

function getToken() {
  return wx.getStorageSync('token') || null;
}

function getOpenid() {
  return wx.getStorageSync('openid') || null;
}

function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const openid = getOpenid();
    const header = { 'Content-Type': 'application/json' };
    if (token) header['Authorization'] = 'Bearer ' + token;
    if (openid) header['X-Openid'] = openid;

    wx.request({
      url: API_BASE + path,
      method,
      header,
      data,
      timeout: 10000,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.navigateTo({ url: '/pages/login/login' });
          reject(new Error('登录已过期'));
        } else {
          reject(new Error(res.data?.error || '请求失败'));
        }
      },
      fail(err) {
        reject(new Error('网络异常'));
      }
    });
  });
}

module.exports = {
  // Products
  getProducts() { return request('GET', '/api/products'); },
  getProduct(id) { return request('GET', '/api/products?id=' + id); },
  getProductsByTag(tag) { return request('GET', '/api/products?tag=' + encodeURIComponent(tag)); },
  scalpMatch(scalpType) { return request('GET', '/api/products?scalp=' + encodeURIComponent(scalpType)); },

  // Cart
  getCart() { return request('GET', '/api/order/cart'); },
  addToCart(productId, quantity = 1) { return request('POST', '/api/order/cart/add', { product_id: productId, quantity }); },
  updateCart(cartId, quantity) { return request('POST', '/api/order/cart/update', { cart_id: cartId, quantity }); },
  removeFromCart(cartId) { return request('POST', '/api/order/cart/remove', { cart_id: cartId }); },

  // Orders
  createOrder(items) { return request('POST', '/api/order/create', { items }); },
  getOrders() { return request('GET', '/api/order/list'); },
  getOrder(id) { return request('GET', '/api/order/detail?id=' + id); },

  // Auth (WeChat mini program)
  weappLogin(code, userInfo) { return request('POST', '/api/weapp/login', { code, userInfo }); },

  // Community
  getPosts(page = 1) { return request('GET', '/api/community/posts?page=' + page); },
  getPost(id) { return request('GET', '/api/community/post?id=' + id); },
  createPost(data) { return request('POST', '/api/community/post/create', data); },
  likePost(postId) { return request('POST', '/api/community/like', { post_id: postId }); },
  unlikePost(postId) { return request('POST', '/api/community/unlike', { post_id: postId }); },
  createComment(postId, content) { return request('POST', '/api/community/comment', { post_id: postId, content }); },
  getComments(postId) { return request('GET', '/api/community/comments?post_id=' + postId); },
  checkIn() { return request('POST', '/api/community/checkin'); },
  getKnowledgeBase() { return request('GET', '/api/community/knowledge'); },

  // Diagnosis
  submitDiagnosis(answers) { return request('POST', '/api/diagnosis/analyze', { answers }); },
  getDiagnosisHistory() { return request('GET', '/api/diagnosis/history'); },

  // Payment (mock for now)
  createPayment(orderId) { return request('POST', '/api/order/pay/create', { order_id: orderId }); },

  // Utils
  get API_BASE() { return API_BASE; }
};
