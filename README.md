# Airaquas 毛发健康平台

安柯耳（Airaquas）AI 毛发健康管理服务平台。

## 架构

- **前端**: Cloudflare Pages (React + Tailwind)
- **API**: Cloudflare Workers (Hono)
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2
- **缓存**: Cloudflare KV
- **CI/CD**: GitHub Actions

## 快速开始

```bash
npm install
cd workers/api-auth && npm install
npm run dev
```

## 部署

```bash
cd workers/api-auth
npm run deploy
```
