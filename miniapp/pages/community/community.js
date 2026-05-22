// 社区
const api = require('../../utils/api');

Page({
  data: {
    posts: [],
    page: 1,
    loading: true,
    hasMore: true,
    showPublish: false,
    publishContent: ''
  },
  onLoad() {
    this.loadPosts();
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },
  onPullDownRefresh() {
    this.setData({ page: 1, posts: [], hasMore: true });
    this.loadPosts().then(() => wx.stopPullDownRefresh());
  },
  loadPosts() {
    return api.getPosts(this.data.page).then(res => {
      const list = res.data || res.posts || res.list || [];
      const posts = Array.isArray(list) ? list : [];
      this.setData({
        posts: this.data.page === 1 ? posts : [...this.data.posts, ...posts],
        loading: false,
        hasMore: posts.length >= 20
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1, loading: true });
      this.loadPosts();
    }
  },
  goPost(e) {
    wx.navigateTo({
      url: '/pages/community-detail/community-detail?id=' + e.currentTarget.dataset.id
    });
  },
  togglePublish() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    this.setData({ showPublish: !this.data.showPublish, publishContent: '' });
  },
  onContentInput(e) {
    this.setData({ publishContent: e.detail.value });
  },
  publishPost() {
    const content = this.data.publishContent.trim();
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发布中...' });
    api.createPost({ content }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      this.setData({ showPublish: false, publishContent: '', page: 1, posts: [] });
      this.loadPosts();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布失败', icon: 'none' });
    });
  },
  likePost(e) {
    const id = e.currentTarget.dataset.id;
    const idx = this.data.posts.findIndex(p => p.id === id);
    if (idx === -1) return;
    if (this.data.posts[idx].liked) {
      api.unlikePost(id);
      const key = `posts[${idx}].liked`;
      const key2 = `posts[${idx}].like_count`;
      this.setData({ [key]: false, [key2]: (this.data.posts[idx].like_count || 1) - 1 });
    } else {
      api.likePost(id);
      const key = `posts[${idx}].liked`;
      const key2 = `posts[${idx}].like_count`;
      this.setData({ [key]: true, [key2]: (this.data.posts[idx].like_count || 0) + 1 });
    }
  },
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getMonth()+1}/${d.getDate()}`;
  }
});
