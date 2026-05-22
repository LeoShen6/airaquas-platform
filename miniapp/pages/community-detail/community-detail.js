// 帖子详情
const api = require('../../utils/api');

Page({
  data: {
    post: null,
    comments: [],
    commentInput: '',
    loading: true
  },
  onLoad(options) {
    if (options.id) {
      this.loadPost(options.id);
    }
  },
  loadPost(id) {
    Promise.all([
      api.getPost(id),
      api.getComments(id)
    ]).then(([postRes, commentRes]) => {
      this.setData({
        post: postRes.data || postRes.post || postRes,
        comments: commentRes.data || commentRes.comments || commentRes || [],
        loading: false
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },
  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },
  submitComment() {
    const content = this.data.commentInput.trim();
    if (!content) return;
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.showLoading({ title: '发送中...' });
    api.createComment(this.data.post.id, content).then(() => {
      wx.hideLoading();
      this.setData({ commentInput: '' });
      this.loadPost(this.data.post.id);
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '评论失败', icon: 'none' });
    });
  },
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }
});
