<h1 align="center">🔥 Douyin Auto Spark</h1>

<p align="center">
  <strong>抖音聊天续火脚本 · Playwright 自动化 · GitHub Actions 定时运行</strong>
</p>

<div align="center">
  <img src="assets/readme/banner.png" alt="Douyin Auto Spark Logo">
</div>
<br>

<div align="center">
  <a href="https://github.com/bling-yshs/douyin-auto-spark/stargazers"><img src="https://img.shields.io/github/stars/bling-yshs/douyin-auto-spark?logo=github&color=yellow" alt="Stars"></a>
  <a href="https://github.com/bling-yshs/douyin-auto-spark/actions/workflows/renew-fire.yml"><img src="https://img.shields.io/github/actions/workflow/status/bling-yshs/douyin-auto-spark/renew-fire.yml?branch=main&label=%E7%BB%AD%E7%81%AB&logo=githubactions" alt="Spark Status"></a>
  <a href="https://github.com/bling-yshs/douyin-auto-spark/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-orange" alt="License"></a>
</div>
<br>

## ✨ 项目简介

本项目是一个基于 **Playwright + TypeScript** 的抖音自动续火脚本。它会携带你配置的抖音 Cookie 打开聊天页，按配置的会话名称依次定位聊天对象，并从 `assets/yiyan.json` 中随机挑选一言发送出去。支持 GitHub Actions、Docker 和本地运行三种方式。

## 🚀 功能特性

- 🎭 **Cookie 登录** - 通过 `DOUYIN_COOKIE` 注入抖音登录态，无需在脚本中输入账号密码
- 🎯 **多会话发送** - 通过 `DOUYIN_TARGET_NAMES` 配置多个聊天对象
- 👥 **多账号续火** - 支持同时为多个账号配置续火
- 💬 **随机一言** - 每次从 `assets/yiyan.json` 随机挑选一条 `hitokoto`，默认以 `——「出处」` 的格式附上来源
- 🤖 **定时续火** - 通过 GitHub Actions 按计划自动续火，失败时由后续时段继续尝试

## 🧰 准备工作

在选择部署方式前，需要先准备抖音 Cookie 和要发送消息的会话名称。

### 1️⃣ 获取抖音 Cookie

1. 使用 Chrome/Edge 打开 [Cookie-Editor 插件页面](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)，安装 Cookie-Editor。 [（Edge点我）](https://microsoftedge.microsoft.com/addons/detail/cookieeditor/neaplmfkghagebokkhpjpoebhdledlfi)

2. 打开 [抖音聊天页](https://www.douyin.com/chat)，并登录你的抖音账号。

3. 登录成功后，点击浏览器右上角的 Cookie-Editor 插件图标。

4. 点击 `Export`，选择 `JSON`，复制导出的完整数组内容。

   ![cookie](assets/readme/cookie.png)

导出的内容大概长这样：

```json
[
  {
    "domain": ".douyin.com",
    "expirationDate": 1800175766.87008,
    "hostOnly": false,
    "httpOnly": false,
    "name": "UIFID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": null,
    "value": "xxx"
  }
]
```

后续配置 `DOUYIN_COOKIE` 时，需要传入整个 JSON 数组。

## 🚀 使用方式

| 使用方式 | 需要自己的设备 | 成功率 | 说明 |
|:---|:---:|:---:|:---|
| [⚙️ GitHub Actions](docs/deployment/github-actions/README.md) | 否 | 低 | 抖音风控严重，基本不可用 |
| [🐳 Docker](docs/deployment/docker/README.md) | 是 | 高 | 推荐使用此方式 |
| [💻 本地运行](docs/deployment/local/README.md) | 是 | 高 | 只推荐无法使用 Docker 时使用此方式 |

<a id="common-config"></a>

## ⚙️ 通用配置

不同部署方式会使用不同的配置入口：GitHub Actions 使用仓库 Secrets，本地运行使用 `.env`，Docker 使用容器环境变量。各配置项的含义保持一致。

| 变量 | 必填 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `DOUYIN_COOKIE` | ✅ | - | Cookie-Editor 导出的完整 Cookie JSON 数组 |
| `DOUYIN_TARGET_NAMES` | ✅ | - | 要发送消息的好友名称 JSON 数组，建议使用抖音备注名 |
| `YIYAN_INCLUDE_SOURCE` | ❌ | `true` | 是否携带一言出处，设置为 `false` 时只发送一言正文 |
| `SPARK_MESSAGE_TEMPLATE` | ❌ | - | 自定义火花消息模板，见下方「✉️ 自定义消息模板」 |
| `PLAYWRIGHT_BROWSER_PATH` | ❌ | - | 本地 Chrome / Chromium / Edge 可执行文件路径；Docker 使用镜像内浏览器 |
| `PLAYWRIGHT_HEADLESS` | ❌ | `true` | 是否使用无头模式，Docker 建议保持 `true` |
| `AUTO_CLOSE` | ❌ | `true` | 发送完成后是否自动关闭浏览器，Docker 建议保持 `true` |

单账号配置使用 `DOUYIN_COOKIE` 和 `DOUYIN_TARGET_NAMES`。多账号配置请查看下方「👥 多账号配置」。


## 📮 邮件通知配置

邮件通知是 GitHub Actions 工作流提供的可选功能。配置 `MAIL_ADDRESS`、`MAIL_USERNAME` 和 `MAIL_PASSWORD` 后，续火失败会发送提醒邮件并附带失败截图；如果定时任务前一次失败、后续补充执行成功，也会发送补充执行成功邮件。

| Secret | 启用邮件时必填 | 说明 |
|:---|:---:|:---|
| `MAIL_ADDRESS` | ✅ | SMTP 发件邮箱地址 |
| `MAIL_USERNAME` | ✅ | SMTP 登录账号，通常与 `MAIL_ADDRESS` 相同 |
| `MAIL_PASSWORD` | ✅ | SMTP 授权码或密码；QQ 邮箱请填写授权码 |
| `MAIL_TO` | ❌ | 收件邮箱，不配置时使用 `MAIL_ADDRESS` |
| `MAIL_HOST` | ❌ | SMTP 服务器地址，默认 `smtp.qq.com` |
| `MAIL_PORT` | ❌ | SMTP 服务器端口，默认 `465` |
| `MAIL_SECURE` | ❌ | 是否使用 SSL，默认 `true` |

如果不需要邮件提醒，不配置这些 Secret 即可。


## 👥 多账号配置

如果你只有一个账号需要续火，那么不需要关注本节。

需要为多个抖音账号续火时，可以配置如 `DOUYIN_ACCOUNTS_1`、`DOUYIN_ACCOUNTS_2`、`DOUYIN_ACCOUNTS_3` 这些变量（一直到 `DOUYIN_ACCOUNTS_10`）。GitHub Actions 将它们配置为 Secrets，本地和 Docker 将它们配置为环境变量。

例如先添加 `DOUYIN_ACCOUNTS_1` ：

```json
[
  {
    "name": "账号1",
    "cookie": [
      {
        "domain": ".douyin.com",
        "expirationDate": 1800175766.87008,
        "hostOnly": false,
        "httpOnly": false,
        "name": "UIFID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "xxx"
      }
    ],
    "targetNames": ["好友A", "好友B"]
  },
  {
    "name": "账号2",
    "cookie": [
      {
        "domain": ".douyin.com",
        "expirationDate": 1800175766.87008,
        "hostOnly": false,
        "httpOnly": false,
        "name": "UIFID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "xxx"
      }
    ],
    "targetNames": ["好友C"],
    "messageTemplate": "{{friend}}，{{account}} 今天来续火啦\\n{{date}} {{weekday}}"
  }
]
```

如果后续账号太多（github 大概一个 secret 只能写两三万字，cookie 太长了很容易存不进去），就把账号放进下一个 Secret：

```text
DOUYIN_ACCOUNTS_1   第一批账号
DOUYIN_ACCOUNTS_2   第二批账号
DOUYIN_ACCOUNTS_3   第三批账号
```

每个账号对象支持的字段：

| 字段 | 必填 | 说明 |
|:---|:---:|:---|
| `name` | ✅ | 当前账号的标识符，账号名称不能重复 |
| `cookie` | ✅ | Cookie-Editor 为这个账号导出的完整 JSON 数组 |
| `targetNames` | ✅ | 这个账号需要发送消息的好友名称数组，建议使用抖音备注名 |
| `messageTemplate` | ❌ | 消息模板，未配置时继承全局模板 |

⚠️ 如果配置了多账号，则会忽略单账号配置

## ✉️ 自定义消息模板

配置 `SPARK_MESSAGE_TEMPLATE` 可定义所有账号共用的默认消息内容；账号对象中的 `messageTemplate` 可以覆盖它：

```dotenv
SPARK_MESSAGE_TEMPLATE={{friend}}，今天的火花到账啦🔥\n{{yiyan}}\n——「{{from}}」\n{{date}} {{weekday}}
```

支持的占位符：

| 占位符 | 说明 |
|:---|:---|
| `{{account}}` | 当前账号的配置名称 |
| `{{friend}}` | 好友名 |
| `{{yiyan}}` | 一言正文 |
| `{{from}}` | 一言出处 |
| `{{date}}` | 日期 `yyyy-MM-dd` |
| `{{time}}` | 时间 `HH:mm` |
| `{{weekday}}` | 星期几 |

## 🔨 开发命令

```bash
# 启动脚本
pnpm dev

# TypeScript 类型检查
pnpm typecheck

# 代码格式化
pnpm format
```

## 📂 项目结构

```text
douyin-auto-spark/
├── .github/workflows/
│   └── renew-fire.yml          # 🚀 GitHub Actions 定时续火任务
├── assets/
│   ├── readme/                 # 🖼️ README 资源
│   └── yiyan.json              # 📚 随机消息数据源
├── src/
│   ├── main.ts                 # 🎭 Playwright 自动化入口
│   └── types/
│       ├── douyin-cookie.ts    # 🍪 抖音 Cookie 类型
│       └── yiyan.ts            # 💬 一言数据类型
├── docs/deployment/            # 📖 部署指南
│   ├── README.md               # 📖 部署方式选择
│   ├── github-actions/         # ⚙️ GitHub Actions 部署
│   ├── local/                  # 💻 本地运行
│   └── docker/                 # 🐳 Docker 部署
├── .cnb.yml                    # 📦 CNB Docker 镜像构建配置
├── .dockerignore               # 🐳 Docker 构建忽略规则
├── Dockerfile                  # 🐳 Docker 镜像构建文件
├── .env.example                # ⚙️ 环境变量示例
├── .gitignore                  # 🙈 Git 忽略规则
├── .oxfmtrc.jsonc              # 🎨 oxfmt 配置
├── .oxlintrc.jsonc             # 🔍 oxlint 配置
├── LICENSE                     # 📄 GPL v3.0 许可证
├── pnpm-lock.yaml              # 🔒 pnpm 依赖锁文件
├── tsconfig.json               # 🧩 TypeScript 配置
└── package.json                # 📦 项目依赖与脚本
```

## 🛠️ 本地环境

|  环境   | 版本要求 |
|:-------:|:--------:|
| Node.js |   20+    |
|  pnpm   |    11    |

## 🔗 主要依赖

| 依赖 | 用途 |
|:---|:---|
| `playwright` | 自动打开浏览器、注入 Cookie、定位会话并发送消息 |
| `dotenv` | 读取本地 `.env` 配置 |
| `tsx` | 本地通过 `pnpm dev` 运行 TypeScript 脚本 |
| `typescript` | 执行 `pnpm typecheck` 类型检查 |
| `oxlint` / `oxfmt` | 代码检查与格式化 |

## 📄 许可证

本项目采用 [GPL v3.0](LICENSE) 开源许可证。
