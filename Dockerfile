FROM mcr.microsoft.com/playwright:v1.61.0-jammy

ARG PNPM_VERSION=11.19.0

RUN npm install --global "pnpm@${PNPM_VERSION}" \
    && pnpm --version

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    PW_TEST_SCREENSHOT_NO_FONTS_READY=1

CMD ["pnpm", "tsx", "src/main.ts"]
