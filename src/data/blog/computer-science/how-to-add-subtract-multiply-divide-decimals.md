---
author: thuongnn
pubDatetime: 2019-11-22T23:22:35Z
modDatetime: 2019-11-22T23:22:35Z
title: "Máy tính cộng trừ nhân chia số thập phân như thế nào?"
draft: false
tags:
  - Algorithms
  - Simulation
  - Floating Point
  - Computer Science
description: Tìm hiểu cách mà máy tính xử lý phép cộng trừ số thập phân.
---

Thật tình cờ trong kỳ học vừa rồi mình có học qua môn SWD391 và được giao đề tài mô phỏng về cách máy tính cộng trừ nhân chia. Mới đầu tìm hiểu thì thấy hơi khó vì tài liệu trên mạng thì tràn lan không rõ ràng cho lắm, sau gần một tuần tìm hiểu và được thầy giáo hỗ trợ cuối cùng mình cũng được thông não^^. Tìm hiểu xong mình thấy khá là thú vị nhưng thấy tài liệu trên mạng toàn tiếng anh với không được rõ ràng lắm nên mình viết bài này để tổng hợp và chia sẻ lại về phần này.

Hầu như mọi người đều biết cộng trừ số thập phần vì nó đã được học từ hồi lớp 5 rồi nhưng máy tính nó sẽ tính toán bằng cách khác nhé. Ở phần này mình sẽ viết về cách máy tính xử lý phép tính cộng và trừ số thập phân.

Mọi người có thể clone chương trình mô phỏng thuật toán về chạy để hiểu rõ hơn nhé. Link repo: [https://github.com/thuongnn/Algorithm-Simulation](https://github.com/thuongnn/Algorithm-Simulation)

## Table of contents

# Cấu trúc số thập phân trong máy tính

Ở bài này mình sẽ trình bày về các phép tính máy tính trên định dạng [Single-Precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format) (32-bits). Khi tính toán, máy tính sẽ chuyển đổi các số thập phân sang dạng số [binary](https://en.wikipedia.org/wiki/Binary_number) rồi mới thực hiện tính toán, mọi người tự tìm hiểu về cách chuyển đổi nhé hoặc có thể dùng [công cụ](http://weitz.de/ieee/) này để chuyển đổi.

![Định dạng số thập phân khi chuyển đổi sang số [binary](https://en.wikipedia.org/wiki/Binary_number)](https://github.com/user-attachments/assets/65d09ce2-5fc1-479b-ac13-6136fc7ff8a7)_Định dạng số thập phân khi chuyển đổi sang số [binary](https://en.wikipedia.org/wiki/Binary_number)_

![Biên giá trị nhỏ nhất và lớn nhất của [Single-Precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)](https://github.com/user-attachments/assets/e764cc57-7c30-47e6-9663-36fc8d730aa9)_Biên giá trị nhỏ nhất và lớn nhất của [Single-Precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)_

Cấu trúc gồm 3 phần: _sign_, _exponent_ và _fraction_ (hay còn gọi là _mantissa_). _Sign_ là phần dấu (+ hoặc -), _exponent_ là phần lũy thừa, _mantissa_ là phần thập phân (quá trình cộng trừ chủ yếu làm việc với phần này).

Trong phần _mantissa_ ngoài dãy 23 bits như định dạng, ta có thêm 2 mục ẩn **E**, **A1**. Định dạng phần _mantissa_ luôn có mục ẩn **A1** có giá trị bằng **1**. Còn mục ẩn **E** chính là phần bit thừa (khi cộng 2 _mantissa_ với nhau), **E** đứng trước **A1** và sẽ bị triệt tiêu rồi đẩy lên phần _exponent_ nếu **E = 1**.
_Ví dụ ở hình trên phần mantissa có giá trị là 0.15625 (chuyển đổi [binary](https://en.wikipedia.org/wiki/Binary_number) sang số thập phân), thêm mục ẩn **A1** thì giá trị đúng phải là 1.15625_

![E và A1 là 2 mục ẩn quan trọng trong phần **mantissa **khi tính toán.](https://github.com/user-attachments/assets/c29212ac-24c5-4451-a8a8-3d200f793860)_E và A1 là 2 mục ẩn quan trọng trong phần **mantissa** khi tính toán._

Về cơ bản thì khi chuyển sang [binary](https://en.wikipedia.org/wiki/Binary_number) thì số thập phân sẽ có cấu trúc như kia, sau khi chuyển sang [binary](https://en.wikipedia.org/wiki/Binary_number) máy tính sẽ tiến hành tính toán rồi lại chuyển ngược lại về số thập phân. Chuyển ngược lại về số thập phân khá là dễ, mọi người tự tìm hiểu trên google nhé :3

# Quy trình cộng trừ số thập phân

Thuật toán cộng trừ số thập phân trong máy tính chia làm 4 bước, mình sẽ giải thích từng bước một kèm theo sơ đồ logic mỗi bước:

Bước 1. Kiểm tra số **0**

Bước 2. Cân bằng phần _exponent_

Bước 3. Cộng bit phần _mantissa_

Bước 4. Chuẩn hóa kết quả

## Bước 1. Kiểm tra số 0

![Bước 1. Kiểm tra số **0**](https://github.com/user-attachments/assets/20d5805a-6820-4f49-8a61-edb746fbcb01)\*Bước 1. Kiểm tra số **0\***

Bước đầu tiên máy tính sẽ kiểm tra 2 số có bằng **0** hay không trước khi tiến hành cộng trừ. **BR** là số trừ (hoặc là số cộng), **AC** là số được cộng (hoặc số bị trừ).

_Bước này rất dễ hiểu, ta chú ý ở trường hợp nếu **AC = 0** và phép tính là trừ thì sẽ phải đổi dấu kết quả (**As **<–** ‘As**). Nếu **BR** và **AC** đều khác **0** thì ta sẽ đi tới bước tiếp theo._

## Bước 2. Cân bằng exponent

![Bước 2. Cân bằng **exponent**](https://github.com/user-attachments/assets/f5f6ace6-0cfd-424c-8514-1d81f4c7be62)\*Bước 2. Cân bằng **exponent\***

1. A, B là ký hiệu của phần _mantissa_ và a, b là ký hiệu phần _exponent_.
2. Tính phần _exponent_ trong [Single-Precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format) (32-bits):

   **K** = 127 (2^(n-1) — 1) với n là số bit _exponent_ (8 bits)

Giống như với việc phải đặt thẳng hàng dấu phẩy khi cộng trừ 2 số thập phân với nhau trong toán lớp 5, thì ở bước này ta phải cân bằng phần _exponent_ bằng cách cộng thêm vào phần _exponent_ kết hợp dịch bit phần _mantissa_.

Ta sẽ so sánh phần _exponent của 2 số_, số có _exponent_ nhỏ hơn sẽ phải cân bằng _exponent_ với số còn lại. Mỗi lần tăng _exponent_ của số nhỏ hơn 1 đơn vị ta đồng thời dịch phần _mantissa_ của số nhỏ hơn sang phải 1 bit (bao gồm cả bit ẩn **A1**). Quá trình này lặp lại đến khi nào 2 phần _exponent_ của 2 số bằng nhau.

## Bước 3. Cộng bit phần mantissa

![Bước 3. Cộng bit phần **mantissa**](https://github.com/user-attachments/assets/c60dfb40-5e83-43e4-8680-12fa91d4b67a)\*Bước 3. Cộng bit phần **mantissa\***

- **As** là dấu của số được cộng (hoặc bị trừ), **Bs** là dấu của số cộng (hoặc trừ).
- **EA** là kết quả cộng của 2 phần _mantissa_.

Mình sẽ giải thích tại sao với phép toán cộng và trừ lại có 2 trường hợp như kia. Đầu tiên mọi người xem qua bảng mà mình tổng hợp bên dưới:

![](https://github.com/user-attachments/assets/7176252a-64d3-4c1f-b7d4-36f121f0f474)

Ở cột _Add Magnitude_ bản chất 2 số A, B giá trị sẽ được cộng với nhau, chỉ là dấu của phép tính có thể bị thay đổi mà thôi. Tương tự thì cột Subtract Magnitude bản chất 2 số A,B giá trị sẽ bị trừ đi và dấu của phép tính có thể bị thay đổi. Tương tự vậy, 2 trường hợp (trong logic bước 3) chính là 2 trường hợp mình đã nói ở bảng trên (_Add Magnitude_ và _Subtract Magnitude_).

Sau khi sử dụng [phép xor](https://vi.wikipedia.org/wiki/Ph%C3%A9p_to%C3%A1n_thao_t%C3%A1c_bit) với dấu của 2 số (**As**, **Bs**) ta bắt đầu tiến hành cộng bit phần _mantissa_. **EA <– A + B’ + 1** nó thể hiện cho trường hợp _Subtract Magnitude_ ở bảng trên, kết quả **EA** trong trường hợp này sử dụng bù 2 ([two’s complement](https://vi.wikipedia.org/wiki/B%C3%B9_2)). Bù 2 sẽ đảo ngược bit **B** (**0** thành **1** và **1** thành **0**) sau đó cộng thêm **1.**

## Bước 4. Chuẩn hóa kết quả

![Bước 4. Chuẩn hóa kết quả](https://github.com/user-attachments/assets/365eee41-b2a4-494d-acb9-3cf876619046)_Bước 4. Chuẩn hóa kết quả_

Đối với chuẩn hóa cho trường hợp **EA <– A + B** sẽ đơn giản hơn, nếu bit thừa **E = 1** ta sẽ thực hiện dịch bit phải phần _mantissa_ như cách cân bằng _exponent_ ở bước 2 rồi trả về kết quả.

Trường hợp còn lại nếu bit thừa **E = 0** (số bị trừ nhỏ hơn số trừ) mọi người phải bù 2 ([two’s complement](https://vi.wikipedia.org/wiki/B%C3%B9_2)) phần _mantissa_ đồng thời nghịch đảo dấu của kết quả. Ngược lại nếu **E = 1** ta bắt đầu kiểm tra phần _mantissa_ **A**, nếu **A = 0** ta sẽ trả về kết quả (đây là trường hợp 2 số trừ nhau bằng 0).

Sau trường hợp **E = 0** hoặc **A # 0** ta sẽ kiểm tra **A1** (bit ẩn mà mình đã nói trong phần cấu trúc). Trường hợp này ta sẽ dịch trái phần _mantissa_ đồng thời giảm 1 đơn vị phần _exponent_ của kết quả, quá trình này lặp lại cho đến khi **A1 = 1** thì trả về kết quả của phép tính.

![](https://github.com/user-attachments/assets/8312589e-67b5-4cef-8d20-315d206ae05d)

Đây là toàn bộ quy trình tính toán cộng trừ số thập phân trong máy tính, khá là phức tạp :3 Mình viết chưa được rõ ràng mọi người có thể clone chương trình mô phỏng thuật toán này trên [github](https://github.com/thuongnn/Algorithm-Simulation) của mình để hiểu rõ hơn nhé. Phần tiếp theo mình sẽ viết về phép nhân, hi vọng mọi người góp ý và ủng hộ ❤

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/8lVqWJ7uoSY" frameborder="0" allowfullscreen></iframe></center>
