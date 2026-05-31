const app = getApp();

Page({
  data: {
    detections: [],
    loading: true,
  },

  onShow() {
    this.fetchHistory();
  },

  fetchHistory() {
    const userId = app.globalData.userInfo?.id;
    if (!userId) {
      this.setData({ loading: false });
      return;
    }
    wx.request({
      url: `${app.globalData.baseUrl}/api/detect/history?userId=${userId}`,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({ detections: res.data.data.items || [], loading: false });
        } else {
          this.setData({ loading: false });
        }
      },
      fail: () => this.setData({ loading: false }),
    });
  },

  viewReport(e) {
    const id = e.currentTarget.dataset.id;
    const record = this.data.detections.find(d => d.id === id);
    if (!record) return;

    // 跳转到检测页面并展示该记录
    const result = record.result || record;
    const pages = getCurrentPages();
    const detectPage = pages.find(p => p.route === 'pages/detect/detect');
    if (detectPage) {
      // 如果检测页面在栈中，回退并展示
      detectPage.setData({ image: 'history', detecting: false, showResult: true, report: result });
      wx.navigateBack({ delta: 1 });
    } else {
      // 否则跳转到检测页
      wx.switchTab({
        url: '/pages/detect/detect',
        success: () => {
          const page = getCurrentPages().find(p => p.route === 'pages/detect/detect');
          if (page) {
            page.setData({ image: 'history', detecting: false, showResult: true, report: result });
          }
        },
      });
    }
  },

  newDetect() {
    wx.switchTab({ url: '/pages/detect/detect' });
  },

  // ===== Helper 函数（在 wxml 中调用） =====

  getScorePercent(score) {
    const s = parseInt(score) || 0;
    return Math.max(0, Math.min(100, s));
  },

  formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hour = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${month}月${day}日 ${hour}:${min}`;
    } catch {
      return isoStr.slice(0, 10);
    }
  },

  getDimList(item) {
    const dims = item.result?.dimensions || item.dimensions;
    if (!dims) return [];
    const list = [];
    for (const key of ['sebum', 'moisture', 'density', 'health']) {
      const d = dims[key];
      if (d && d.score !== undefined) {
        list.push(`${d.label || key}: ${d.score}分`);
      }
    }
    return list;
  },
});
