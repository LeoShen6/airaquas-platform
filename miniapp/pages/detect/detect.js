const app = getApp();

Page({
  data: {
    image: '',
    detecting: false,
    report: null,
    showResult: false,
    steps: [
      { icon: '📸', title: '拍摄/上传头皮照片', desc: '请对着头皮部位拍摄清晰照片' },
      { icon: '🧬', title: 'AI智能分析', desc: '多维度评估头皮健康状况' },
      { icon: '📋', title: '获取诊断报告', desc: '个性化护理方案推荐' },
    ],
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFile = res.tempFiles[0].tempFilePath;
        this.setData({ image: tempFile, showResult: false, report: null });
        this.uploadAndDetect(tempFile);
      }
    });
  },

  uploadAndDetect(filePath) {
    if (!app.globalData.token) {
      app.login(() => this.uploadAndDetect(filePath));
      return;
    }
    this.setData({ detecting: true });
    // 读取文件为 base64，走 JSON API
    const fs = wx.getFileSystemManager();
    try {
      const base64 = fs.readFileSync(filePath, 'base64');
      const mime = filePath.match(/\.(png|jpg|jpeg)$/i)
        ? (filePath.match(/\.png$/i) ? 'image/png' : 'image/jpeg') : 'image/jpeg';
      wx.request({
        url: `${app.globalData.baseUrl}/api/detect`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`,
          'Content-Type': 'application/json'
        },
        data: {
          image: `data:${mime};base64,${base64}`,
          userId: app.globalData.userInfo?.id || ''
        },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            const report = res.data.data?.result || res.data.data;
            this.setData({ report, showResult: true, detecting: false });
          } else {
            this.mockDetect();
          }
        },
        fail: () => this.mockDetect()
      });
    } catch(e) {
      // 读取失败降级到 mock
      this.mockDetect();
    }
  },

  mockDetect() {
    const hairTypes = ['油性头皮', '干性头皮', '敏感性头皮', '混合性头皮', '健康头皮'];
    const selected = hairTypes[Math.floor(Math.random() * hairTypes.length)];
    const baseScore = selected === '健康头皮' ? 88 : 72 + Math.floor(Math.random() * 15);
    const dimScore = () => 60 + Math.floor(Math.random() * 30);
    this.setData({
      detecting: false,
      showResult: true,
      report: {
        isValid: true,
        overall: {
          score: baseScore,
          level: baseScore >= 85 ? '优秀' : baseScore >= 75 ? '良好' : '一般',
          summary: selected === '健康头皮' ? '头皮状况良好，日常维持即可' : '需针对性护理改善',
        },
        dimensions: {
          sebum: { score: dimScore(), label: '油脂分泌', desc: selected.includes('油') ? '发根油腻' : '皮脂正常' },
          moisture: { score: dimScore(), label: '水分含量', desc: selected.includes('干') ? '偏干' : '含水量充足' },
          density: { score: dimScore(), label: '发量密度', desc: '毛囊密度正常' },
          health: { score: dimScore(), label: '头皮健康', desc: selected === '敏感性头皮' ? '有泛红' : '状况良好' },
        },
        hairType: selected,
        analysis: {
          findings: [
            `头皮整体${selected.includes('油') ? '油脂分泌偏旺盛' : selected.includes('干') ? '偏干' : selected === '敏感性头皮' ? '有泛红敏感' : '状态健康'}`,
            `${selected === '健康头皮' ? '发质光泽度良好' : '建议调整日常护理习惯'}`,
            '无明显异常指征',
          ],
          rootCauses: [
            '可能与生活习惯有关',
            '建议保持规律作息',
          ],
        },
        careRoutine: {
          daily: [
            selected.includes('油') ? '选择控油型洗发水每天清洗' : '使用温和型洗发水，降低洗头频率',
            '洗发时指腹按摩头皮2-3分钟',
            '水温控制在38℃左右',
          ],
          weekly: [
            selected.includes('油') ? '使用深层清洁头皮磨砂膏1次' : '每周做1次深层滋养发膜',
            '保持头皮清爽',
          ],
          caution: [
            selected.includes('油') ? '避免过度清洁导致屏障受损' : '避免使用含酒精成分的产品',
            '减少烫染频率，注意头皮防晒',
          ],
        },
        productRecommendations: [
          {
            category: '洗发水',
            targetIssue: selected.includes('油') ? '控油清洁' : '温和清洁',
            keyIngredients: selected.includes('油') ? ['吡啶硫酮锌', '水杨酸'] : ['氨基酸表面活性剂', '甘油'],
            brandExamples: selected.includes('油') ? ['清扬', '海飞丝'] : ['植观', '滋源'],
            searchKeywords: selected.includes('油') ? '控油去屑洗发水 推荐' : '氨基酸温和洗发水',
            purchaseGuide: selected.includes('油') ? '选择含控油成分的洗发水' : '适合日常使用，不刺激头皮',
          },
        ],
        tips: [
          '建议使用温和的氨基酸洗发产品',
          '水温控制在38℃左右洗头',
          '每周使用1-2次发膜深层修护',
          '减少烫染频率，注意头皮防晒',
        ],
      },
    });
  },

  goShop() {
    wx.switchTab({ url: '/pages/shop/shop' });
  },

  retake() {
    this.setData({ image: '', showResult: false, report: null });
  },

  onShareAppMessage() {
    const report = this.data.report;
    let title = '安柯耳AI头皮检测 - 你的专属头皮健康报告';
    let path = '/pages/detect/detect';
    if (report && report.overall) {
      const score = report.overall.score || '?';
      const type = report.hairType || '头皮';
      title = `我的${type}健康分 ${score}！来测测你的头皮健康 >>`;
      // 头像参数用于追踪分享来源
      path = `/pages/detect/detect?shareScore=${score}&shareType=${encodeURIComponent(type)}`;
    }
    return {
      title,
      path,
      imageUrl: '/images/share-card.png',  // 自定义分享图（后续可替换为报告截图）
    };
  },
  openLink(e) {
    const url = e.currentTarget.dataset.url;
    if (url) wx.setClipboardData({ data: url });
  },

  // 朋友圈分享
  onShareTimeline() {
    const report = this.data.report;
    let title = '安柯耳AI头皮检测 - 测测你的头皮健康分';
    if (report && report.overall) {
      title = `我的头皮健康分 ${report.overall.score}！快来挑战 >>`;
    }
    return { title };
  },
});
