# covid19-alert-example
Notification of covid19 confirmed cases using Github actions

# Document
[공공데이터 포털 - 코로나19 현황](https://www.data.go.kr/data/15043376/openapi.do)  
[Github Actions](https://docs.github.com/en/free-pro-team@latest/actions)  

# Github Action
* 동작 조건
    + `master` 브랜치에 *push* 될 때
    + 매일 *오전 11시(KST 기준)*
* 동작 환경
    + Ubuntu 16.04
    + Node.js 12.x
* 전달 파라메터
    + Action 이 동작할 때 전달하는 파라메터로 repository 의 Secret 메뉴에 등록한다.
        - OPEN_API_ACCESS_KEY: 공공 데이터 포털에서 발급받은 serviceKey
        - SLACK_TOKEN: Slack 에서 발급받은 Auth Token
        - SLACK_CHANNEL_ID: 메세지를 발송할 Slack 의 채널 혹은 사용자 Id

```
name: Announcement of confirmed patients today

on:
    push:
        branches:
            - master
    schedule:
        - cron: '0 2 * * *'

jobs:
    start:
        runs-on: ubuntu-16.04
        strategy:
            matrix:
                node-version: [12.x]
        env:
            OPEN_API_ACCESS_KEY: ${{secrets.OPEN_API_ACCESS_KEY}}
            SLACK_TOKEN: ${{secrets.SLACK_TOKEN}}
            SLACK_CHANNEL_ID: ${{secrets.SLACK_CHANNEL_ID}}
        steps:
            - uses: actions/checkout@v2
            - name: Setup Node.JS
              uses: actions/setup-node@v1
              with: 
                  node-version: ${{matrix.node-version}}
            - run: |
                npm install
                npm start
```

# Issue
## 공공데이터 API 호출 시 `503 - Service Unavailable` 에러 발생
로컬환경에서 테스트 시에는 발생하지 않던 `503 - Service Unavailable` 에러가 발생한다. 이 경우 아래의 경우를 확인하여 해결한다.
* 공공데이터 API 호출 시 사용되는 serviceKey 의 값을 확인한다.
    + 공공데이터 포털에서 제공되는 serviceKey 는 기본적으로 URL encoding 이 되어있기 때문에 코드에서 사용하려면 URL decoding 후 사용하여야한다.
* 공공데이터 API 호출 시 설정한 timeout 값을 확인한다.
    + 로컬환경에서 설정한 timeout 보다 길게 설정하여야한다.
