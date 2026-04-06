# 🌐 翻译器 | Translator

一个简洁优雅的在线翻译网站，支持英文 ↔ 中文互译。

## ✨ 功能特性

- **双向翻译**: 英文 ↔ 中文自动检测与翻译
- **智能检测**: 自动识别输入语言（中文/英文）
- **实时翻译**: 输入后自动触发翻译（800ms 防抖）
- **快捷操作**: `Ctrl+Enter` 快速翻译
- **翻译历史**: 自动保存最近10条翻译记录
- **深色模式**: 支持亮色/暗色主题切换
- **响应式设计**: 完美适配手机、平板、桌面端
- **零依赖**: 纯 HTML/CSS/JS，无需任何框架

## 🚀 在线访问

访问 👉 **https://aiweisoft.github.io/translator-site/** 即可使用。

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 自定义属性主题、响应式布局、动画
- **JavaScript (ES6+)** - 异步请求、本地存储、事件处理
- **翻译 API**:
  - 主 API: [MyMemory](https://mymemory.translated.net/)
  - 备用 API: [LibreTranslate](https://libretranslate.com/)
- **部署**: GitHub Actions + GitHub Pages

## 📁 项目结构

```
translator-site/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 翻译逻辑
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 部署配置
└── README.md           # 项目说明
```

## 🔄 自动部署

本项目配置了 GitHub Actions 自动部署：

- 每次推送到 `main` 分支时自动触发部署
- 也可手动触发（workflow_dispatch）
- 部署到 GitHub Pages，约1-2分钟生效

## 💻 本地运行

无需任何构建工具，直接用浏览器打开即可：

```bash
# 克隆仓库
git clone https://github.com/aiweisoft/translator-site.git

# 进入目录
cd translator-site

# 直接用浏览器打开 index.html
# 或使用任意本地服务器
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 📝 使用说明

1. 在左侧输入框输入要翻译的文本
2. 系统自动检测语言并翻译
3. 点击 🔄 按钮交换翻译方向
4. 点击 📋 按钮复制翻译结果
5. 点击 ✕ 按钮清空输入
6. 展开底部翻译历史查看之前的翻译记录
7. 点击 🌙/☀️ 切换深色/亮色主题

## 📄 License

MIT License
