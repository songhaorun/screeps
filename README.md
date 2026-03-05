# Screeps AI

基于 TypeScript + Rollup 构建的 Screeps 游戏 AI 项目。

## 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

## 安装依赖

```bash
npm install
```

## 配置部署目标

在项目根目录创建 `.screeps.json` 文件，用于配置代码上传目标。该文件**不应提交到版本控制**。

### 使用 Token 认证（推荐）

```json
{
  "main": {
    "token": "你的 Screeps Token",
    "protocol": "https",
    "hostname": "screeps.com",
    "port": 443,
    "path": "/",
    "branch": "default"
  }
}
```

> Token 可在 [Screeps 账户页面](https://screeps.com/a/#!/account/auth-tokens) 获取。

### 使用本地客户端（复制到文件夹）

如果使用 Steam 客户端或私服，可通过 `copyPath` 将编译结果直接复制到本地目录：

```json
{
  "main": {
    "copyPath": "/path/to/screeps/scripts"
  }
}
```

### 配置多个目标

`.screeps.json` 支持配置多个部署目标，通过 `DEST` 环境变量指定使用哪个：

```json
{
  "main": {
    "token": "官服 Token",
    "protocol": "https",
    "hostname": "screeps.com",
    "port": 443,
    "path": "/",
    "branch": "default"
  },
  "local": {
    "copyPath": "/path/to/local/scripts"
  }
}
```

## 构建与部署

| 命令 | 说明 |
|------|------|
| `npm run build` | 编译 TypeScript，**不上传**，仅输出到 `dist/` |
| `npm run push` | 编译并上传到 `.screeps.json` 中的 `main` 目标 |

> 两个命令均以 **watch 模式**运行，文件修改后会自动重新编译。按 `Ctrl+C` 退出。

### 上传到自定义目标

```bash
# 上传到 .screeps.json 中名为 "local" 的目标
npx rollup -cw --environment DEST:local
```

## 编译输出

编译后的文件输出到 `dist/main.js`，同时生成 `dist/main.js.map` 用于 Source Map 错误溯源。
