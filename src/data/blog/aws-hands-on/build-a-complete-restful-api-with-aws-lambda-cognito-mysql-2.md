---
author: thuongnn
pubDatetime: 2019-05-24T22:50:35Z
modDatetime: 2019-05-24T22:50:35Z
title: "[Phần 2] Xây dựng RESTful API hoàn chỉnh với AWS Lambda + Cognito + MySQL"
draft: false
tags:
  - AWS
  - Devops
  - Architecture
description: Triển khai kiến trúc serverless với AWS Cloud phần 2.
ogImage: https://github.com/user-attachments/assets/f690c4e3-e062-48c0-a9d0-eecc94f2be4f
---

AWS Cognito là một dịch vụ kiểm soát truy cập người dùng đơn giản và bảo mật, nó hỗ trợ đăng nhập thông qua các nhà cung cấp định danh mạng xã hội như Facebook, Google. Trong bài viết này mình sẽ hướng dẫn mọi người xây dựng hệ thống đăng nhập sử dụng AWS Cognito và AWS Amplify trong dự án nhé :D

Trong phần trước mình đã giới thiệu qua về kiến trúc [Serverless](https://thuongnn.me/xay-dung-restful-api-voi-serverless-famwork/) cũng như các dịch vụ của Amazon AWS mà mình sẽ sử dụng trong series này. Ở phần này mình sẽ hướng dẫn mọi người xây dựng lớp bảo mật sử dụng [AWS Cognito](https://aws.amazon.com/vi/cognito/) và [AWS Amplify](https://aws.amazon.com/vi/amplify/) trong dự án, tạo một trang đăng nhập sử dụng [React](https://reactjs.org/) và trả về [JWT Token](https://jwt.io).

![Authentication with AWS Cognito](https://github.com/user-attachments/assets/f690c4e3-e062-48c0-a9d0-eecc94f2be4f)_Authentication with AWS Cognito_

## Table of contents

## Xây dựng trang đăng nhập với [AWS Amplify](https://aws.amazon.com/vi/amplify/)

Mọi người mở Terminal và cài **AWS Amplify CLI** trước tiên:

```shell
npm install -g aws-amplify/cli
amplify configure
```

Đảm bảo rằng CLI được cài ở global (-g), mọi người chạy tiếp lệnh sau và làm theo mình:

```shell
amplify configure
```

Chạy lệnh `amplify configure` nó sẽ tự chuyển hướng đến Amazon Console, mọi người đăng nhập với tài khoản AWS đã tạo từ trước và quay lại Terminal.

![Lựa chọn region: **us-east-2**, ấn **Enter** để tiếp tục](https://github.com/user-attachments/assets/500599d6-15a0-4167-8af0-052320aa7041)_Lựa chọn region: **us-east-2**, ấn **Enter** để tiếp tục_

**Enter** tiếp để Amplify CLI tự chuyển hướng đến trang **IAM (Identity and Access Management)**. Đây là trang quản lý người dùng cho nhà phát triển, ví dụ trong một dự án sẽ có developer, tester, devops thì IAM cho phép tạo tài khoản thành viên với những quyền hạn được cho phép.

![Màn hình tạo tài khoản **IAM (Identity and Access Management)**](https://github.com/user-attachments/assets/e32968a5-44bd-465b-8c86-09f0b72335e9)\*Màn hình tạo tài khoản **IAM (Identity and Access Management)\***

Amplify CLI đã tự động thiết lập sẵn rồi, mọi người chỉ cần thay đổi một số thông tin như _User name_ sau đó cứ nhấn _Next_ để tiếp tục.

![](https://github.com/user-attachments/assets/87d54768-6d8c-4065-9acf-0b755c44fc03)

![](https://github.com/user-attachments/assets/f96f80c6-1cd5-457c-abc5-40661a026dd5)

Sau khi tạo thành công tài khoản IAM, mọi người chú ý **Access key ID** và **Secret access key** copy và paste vào trong Terminal. Để khởi tạo dự án frontend React mọi người chạy lệnh sau:

```shell
yarn create react-app myapp
cd myapp
```

Tiếp tục chạy lệnh `amplify init` để _config_ amplify cho dự án và chọn những option như trong ảnh dưới:

![](https://github.com/user-attachments/assets/81766ac5-f54e-403c-b281-9562d6e15621)

Để liên kết đăng nhập với mạng xã hội [Facebook](https://www.facebook.com/) hoặc [Google](https://www.google.com/) thì mọi người cần phải có Application ID (đối với [Facebook](https://developers.facebook.com)) và Client ID (đối với [Google](https://developers.google.com)). Truy cập link bên dưới để tiến hành tạo và lấy Application ID, Client ID:
[https://developers.facebook.com](https://developers.facebook.com/)
[https://developers.google.com](https://developers.google.com/)

![developers.facebook.com](https://github.com/user-attachments/assets/60fa424b-d0aa-43e4-9f64-285f3f41ec8b)_developers.facebook.com_

![developers.google.com](https://github.com/user-attachments/assets/ce5ae047-e129-4700-bdeb-ee297834624e)_developers.google.com_

Tiếp tục với Terminal, chạy lệnh sau và chọn **Default configuration** để cài đặt Authentication cho dự án:

```shell
amplify add auth
```

Để liên kết Authentication với mạng xã hội Facebook hay Google mọi người chạy lệnh sau và làm theo mình:

```shell
amplify update auth
```

![](https://github.com/user-attachments/assets/fc0cab1d-de26-42c1-80d9-b4b41b94a9de)

Ở những lựa chọn tiếp theo nếu nó hỏi gì mọi người cứ **Enter** để nó cài đặt theo mặc định nhé, nếu có chỗ nó yêu cầu _Enter your redirect URL_ thì điền vào [http://localhost:3000/](http://localhost:3000/), những thông tin này mọi người có thể lên Amazon Console để thay đổi sau. Sau khi cài đặt xong mọi người chạy lệnh sau:

```shell
amplify push
```

Chờ một lúc Amplify CLI sẽ tự động tạo và cài đặt những thông tin vừa setup lên Amazon Console, sau đó mọi người lên AWS Cognito Console để kiểm tra.

![](https://github.com/user-attachments/assets/51ebc547-f8d9-4dc6-91e5-37cea30af85b)

OK vậy là xong, giờ cài thêm thư viện UI của Amplify vào project bằng lệnh sau trên Terminal:

```shell
yarn add aws-amplify aws-amplify-react
```

Tiếp đến mọi người mở project lên và code một chút nhé :3 Tạo file Home.js trong thư mục src, sau khi đăng nhập xong sẽ redirect đến trang này.

```jsx
import React, { Component } from "react";
import { Auth } from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      token: "",
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(user => {
      let email = user["email"];
      console.log("user", user);
      Auth.currentCredentials().then(credentials => {
        let Logins = credentials["params"]["Logins"];
        console.log("credentials", credentials);
        let jwtToken = Object.values(Logins);
        this.setState({ token: jwtToken, email: email });
      });
    });
  }

  render() {
    const { email, token } = this.state;
    return (
      <div className="Home">
        <div className="lander">
          <div>{email}</div>
          <h1>JWT Token</h1>
          <textarea
            style={{ width: "60%", padding: "6px" }}
            rows={7}
            readOnly
            value={token}
          />
        </div>
      </div>
    );
  }
}
```

Trong thư mục src mọi người mở file App.js lên và sửa lại như sau:

```jsx
import React, { Component } from "react";
import Home from "./Home";

import Amplify from "aws-amplify";
import { Authenticator } from "aws-amplify-react/dist/Auth";
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);
const federated = {
  google_client_id:
    "345185909456-oosi4vr959gt4i3k0q0vmlm2ki242j1f.apps.googleusercontent.com",
  facebook_app_id: "155841285330063",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  setStateLogin = status => {
    this.setState({ isLogin: status });
  };

  render() {
    const { isLogin } = this.state;
    return (
      <Authenticator
        onStateChange={authState =>
          authState === "signedIn"
            ? this.setStateLogin(true)
            : this.setStateLogin(false)
        }
        federated={federated}
      >
        {isLogin ? <Home /> : ""}
      </Authenticator>
    );
  }
}

export default App;
```

Bây giờ chạy lệnh $ yarn start lên và hưởng thụ thành quả nào :D

![Màn hình đăng nhập](https://github.com/user-attachments/assets/203189f2-74ca-4a85-9089-94bcc9169b42)_Màn hình đăng nhập_

![Màn hình Home.js](https://github.com/user-attachments/assets/5943b01c-ca4d-404e-939b-9674fc777dc7)_Màn hình Home.js_

## Tổng kết

Vậy là đã hoàn thiện xong trang đăng nhập sử dụng [AWS Cognito](https://aws.amazon.com/vi/cognito/) và [AWS Amplify](https://aws.amazon.com/vi/amplify/), sau khi đăng nhập ta sẽ dùng JWT Token để truy vấn API lấy dữ liệu. Trong phần tới mình sẽ hướng dẫn mọi người sử dụng [Serverless Framework](https://serverless.com/) để xây dựng RESTful API và thiết lập Authentication AWS Cognito với API Gateway nhé. Cảm ơn mọi người đã dành thời gian đọc bài viết này ❤

### Tài liệu tham khảo

[https://aws-amplify.github.io/docs](https://aws-amplify.github.io/docs/)
