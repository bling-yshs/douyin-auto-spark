<h1 align="center">🔥 Douyin Auto Spark</h1>

<p align="center">
  <strong>抖音聊天续火脚本 · Playwright 自动化 · GitHub Actions 定时运行</strong>
</p>

<div align="center">
  <img src="assets/readme/logo.png" alt="Douyin Auto Spark Logo" width="120">
</div>
<br>

<div align="center">
  <a href="https://github.com/bling-yshs/douyin-auto-spark/stargazers"><img src="https://img.shields.io/github/stars/bling-yshs/douyin-auto-spark?logo=github&color=yellow" alt="Stars"></a>
  <a href="https://github.com/bling-yshs/douyin-auto-spark/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-orange" alt="License"></a>
</div>
<br>

## ✨ 项目简介

本项目是一个基于 **Playwright + TypeScript** 的抖音聊天自动化脚本。它会携带你配置的抖音 Cookie 打开聊天页，按配置的会话名称依次定位聊天对象，并从 `assets/yiyan.json` 中随机挑选一言发送出去。

适合放到 GitHub Actions 中定时运行，也可以在本地用 `pnpm dev` 手动执行。

## 🚀 功能特性

- 🎭 **Cookie 登录** - 通过 `DOUYIN_COOKIE` 注入抖音登录态，无需脚本内输入账号密码
- 🎯 **多会话发送** - 通过 `DOUYIN_TARGET_NAMES` 配置多个聊天对象
- 💬 **随机一言** - 每次从 `assets/yiyan.json` 随机挑选一条 `hitokoto`，默认以 `——「出处」` 的格式附上来源
- 🤖 **定时续火** - 通过 Github Action 每天 0 点自动续火（但是 Github 定时任务要排队，可能会延迟几个小时）

## 🧰 准备工作

在配置 GitHub Actions 或本地 `.env` 之前，需要先准备抖音 Cookie 和要发送消息的会话名称。

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
    "value": "替换成真实 Cookie 值"
  }
]
```

后面配置 `DOUYIN_COOKIE` 时，需要把整个 JSON 数组作为一行字符串填进去。

## 运行方式
### ⚙️ GitHub Actions

推荐直接使用 GitHub Actions 定时运行

#### 1️⃣ Fork 项目

点击 GitHub 页面右上角的 `Fork`（同时希望可以 star ⭐一下本项目），把本项目复制到你自己的 GitHub 账号下。

![fork](assets/readme/fork.jpg)

Fork 后进入你自己的仓库，例如：

```text
https://github.com/你的用户名/douyin-auto-spark
```

#### 2️⃣ 配置 Secrets

进入你 Fork 后的仓库：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

![add-secret](assets/readme/add-secret.jpg)

添加以下 secrets：

| Secret | 必填 | 说明 |
|:---|:---:|:---|
| `DOUYIN_COOKIE` | ✅ | 抖音 Cookie JSON 字符串数组 （上面用浏览器插件获取的那个） |
| `DOUYIN_TARGET_NAMES` | ✅ | 需要续火的朋友的用户名称， JSON 字符串数组，例如 ["暮邵落白"] （不会写 JSON 可以问 AI）。建议在抖音中给好友设置备注名并填备注名，好友改昵称也不会中断续火 |
| `YIYAN_INCLUDE_SOURCE` | ❌ | 是否携带一言出处，默认开启；设置为 `false` 时只发送正文 |
| `SPARK_MESSAGE_TEMPLATE` | ❌ | 自定义火花消息模板，见下方「✉️ 自定义消息模板」 |
| `MAIL_ADDRESS` | ❌ | 任务失败提醒的收件邮箱，同时作为邮件发件人地址 |
| `MAIL_USERNAME` | ❌ | QQ 邮箱 SMTP 登录账号，通常与 `MAIL_ADDRESS` 相同 |
| `MAIL_PASSWORD` | ❌ | QQ 邮箱 SMTP 授权码 |

配置 `MAIL_ADDRESS`、`MAIL_USERNAME` 和 `MAIL_PASSWORD` 后，续火失败会向 `MAIL_ADDRESS` 发送提醒邮件，并附带失败图片。

#### 3️⃣ 手动运行一次

```text
Actions -> 点击绿色的 I understand my workflows, go ahead and enable them -> 🚀 续一次火 -> Enable workflow -> Run workflow
```

点击 `Run workflow` 后等待任务完成。手机打开抖音，你就可以发现你发了一条嘉豪语录给朋友了

![run-workflow](assets/readme/run-workflow.jpg)

#### 4️⃣ 每天自动运行

如果手动运行一次没报错，那么默认情况下，每天北京时间 0 点会自动续一次火（不需要配置任何其他东西），但是由于 github 会延迟，大概最多凌晨 3 点之前会自动续一次火

### 💻 本地运行

#### 1️⃣ 安装依赖

本地调试需要 Node.js 和 pnpm

```bash
pnpm install
```

#### 2️⃣ 配置环境变量

复制 `.env.example` 为 `.env`，并按实际情况修改：

```bash
cp .env.example .env
```

核心配置如下：

| 变量 | 必填 | 默认值 | 说明 |
|:---|:---:|:---:|:---|
| `DOUYIN_COOKIE` | ✅ | - | 抖音 Cookie JSON 字符串数组 |
| `DOUYIN_TARGET_NAMES` | ✅ | - | 要发送消息的会话名称 JSON 字符串数组 |
| `YIYAN_INCLUDE_SOURCE` | ❌ | `true` | 是否携带一言出处，设置为 `false` 时只发送正文 |
| `SPARK_MESSAGE_TEMPLATE` | ❌ | - | 自定义火花消息模板，见下方「自定义消息模板」 |
| `PLAYWRIGHT_BROWSER_PATH` | ❌ | - | 本机 Chrome / Chromium / Edge 可执行文件路径，不填则使用 Playwright 默认浏览器 |
| `PLAYWRIGHT_HEADLESS` | ❌ | `true` | 是否使用无头模式 |
| `AUTO_CLOSE` | ❌ | `true` | 发送完成后是否自动关闭浏览器 |

`DOUYIN_TARGET_NAMES` 示例：

```dotenv
DOUYIN_TARGET_NAMES='["暮邵落白"]'
```

> 💡 **建议填备注名而不是昵称**
>
> 脚本靠聊天页搜索框定位好友，好友一旦改昵称就会搜不到，火花随之中断。
> 在抖音中给好友设置备注后，搜索框同样能按备注名搜到人，而备注是你自己设置的，
> 好友再怎么改昵称都不受影响。设置方式：好友主页 → 右上角 `...` → 设置备注。

`DOUYIN_COOKIE` 使用准备工作中导出的 Cookie JSON 数组：

```dotenv
DOUYIN_COOKIE='[{"domain":".douyin.com","expirationDate":1800175766.87008,"hostOnly":false,"httpOnly":false,"name":"UIFID","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":null,"value":"替换成真实 Cookie 值"}]'
```

#### 3️⃣ 启动项目

```bash
pnpm dev
```

脚本会打开 `https://www.douyin.com/chat`，等待页面加载，定位配置中的会话名称，发送随机一言，并在发送后等待约 5 秒再退出。

## ✉️ 自定义消息模板

配置 `SPARK_MESSAGE_TEMPLATE` 可自定义消息内容：

```dotenv
SPARK_MESSAGE_TEMPLATE={{friend}}，今天的火花到账啦🔥\n{{yiyan}}\n——「{{from}}」\n{{date}} {{weekday}}
```

支持的占位符：

| 占位符 | 说明 |
|:---|:---|
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
