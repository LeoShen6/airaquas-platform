# 安柯耳毛发健康 - 微信小程序

## 项目说明

安柯耳毛发健康平台的小程序端，基于微信原生框架开发。

## 前置条件

1. 微信小程序 AppID（在 `project.config.json` 中填写）
2. 后端 API 已部署（当前指向 `airaquas-api-gateway.jfh-099.workers.dev`）
3. 微信开发者工具

## 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | pages/index | 产品推荐、AI检测入口 |
| 产品列表 | pages/products | 分类浏览、按标签筛选 |
| 产品详情 | pages/product | 产品展示、加入购物车 |
| 购物车 | pages/cart | 管理购物车、结算 |
| 下单 | pages/order | 确认订单、提交 |
| 登录 | pages/login | 微信授权登录 |
| 社区 | pages/community | 浏览/发布帖子 |
| 帖子详情 | pages/community-detail | 查看评论、发表评论 |
| 我的 | pages/profile | 订单、个人资料 |

## 开发

用微信开发者工具打开 `miniapp/` 目录即可。

## 环境配置

API 地址在 `utils/api.js` 中配置，默认使用生产环境网关。
