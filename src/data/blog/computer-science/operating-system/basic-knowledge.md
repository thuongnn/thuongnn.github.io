---
author: thuongnn
pubDatetime: 2020-07-11T23:21:35Z
title: "[Computer Science] Kiến thức về OS cơ bản"
featured: false
draft: false
tags:
  - Operating System
  - Computer Science
description: Tổng hợp câu hỏi và trả lời về OS cơ bản.
---
Bài viết tổng hợp câu trả lời cho các câu hỏi về OS cơ bản trong computer science được fork từ repo: https://github.com/vietnakid/learning-material.git

## Table of contents

## What is `process`, `thread`? What are the differents between them?

- **Process (Tiến trình):**
    - **Process** là một chương trình đang chạy trên hệ điều hành, bao gồm mã lệnh (code), dữ liệu, và trạng thái thực thi.
    - Mỗi process là một thực thể độc lập, có không gian địa chỉ bộ nhớ riêng (virtual memory space) và tài nguyên riêng (file descriptors, stack, heap, v.v.).
    - Ví dụ: Khi mày mở Chrome, nó chạy như một process.
- **Thread (Luồng):**
    - **Thread** là một đơn vị thực thi nhỏ nhất trong một process. Một process có thể chứa nhiều thread, và các thread chia sẻ cùng không gian bộ nhớ, tài nguyên của process mẹ.
    - Thread có stack riêng (cho biến cục bộ và call stack), nhưng chia sẻ code, heap, và dữ liệu toàn cục với các thread khác trong cùng process.
    - Ví dụ: Trong Chrome, một tab có thể chạy trên một thread riêng.
- **Sự khác biệt:**


    | **Tiêu chí** | **Process** | **Thread** |
    | --- | --- | --- |
    | Không gian bộ nhớ | Riêng biệt, không chia sẻ | Chia sẻ với các thread trong process |
    | Tài nguyên | Có tài nguyên riêng (file, memory) | Chia sẻ tài nguyên của process |
    | Tạo/Kết thúc | Chậm hơn (cần cấp phát tài nguyên) | Nhanh hơn (dùng chung tài nguyên) |
    | Giao tiếp | Khó hơn (IPC: pipe, socket) | Dễ hơn (truy cập bộ nhớ chung) |
    | Độc lập | Độc lập hoàn toàn | Phụ thuộc process mẹ |
    | Ví dụ | Chrome, Notepad chạy riêng | Nhiều tab trong Chrome |

---

### **What data process, thread need to live? Why they said that Thread is a lightweight process?**

- **Data process need to live:**
    - **Program Counter (PC):** Chỉ vị trí lệnh đang thực thi.
    - **Registers:** Lưu giá trị tạm (như CPU registers: EAX, EBX).
    - **Stack:** Lưu biến cục bộ, địa chỉ trả về của hàm.
    - **Heap:** Bộ nhớ động cho dữ liệu lớn.
    - **Code Segment:** Mã lệnh của chương trình.
    - **Data Segment:** Biến toàn cục, dữ liệu tĩnh.
    - **File Descriptors:** Quản lý file, socket mở.
    - **Virtual Memory:** Không gian địa chỉ riêng (do kernel cấp).
- **Data thread need to live:**
    - **Program Counter (PC):** Riêng cho mỗi thread để theo dõi lệnh đang chạy.
    - **Registers:** Riêng để lưu trạng thái thực thi.
    - **Stack:** Riêng cho mỗi thread (cho biến cục bộ, call stack).
    - **Chia sẻ:** Code, heap, data segment, file descriptors từ process mẹ.

### **Why thread is a lightweight process?**

- **Nhẹ hơn process vì:**
    - Thread không cần không gian bộ nhớ riêng hay tài nguyên riêng như process. Nó dùng chung code, heap, và dữ liệu của process mẹ → tiết kiệm RAM và thời gian khởi tạo.
    - Tạo thread nhanh hơn (chỉ cấp stack và registers), trong khi tạo process cần sao chép toàn bộ tài nguyên (fork trong Linux).
    - Chuyển đổi giữa các thread (context switch) nhanh hơn vì không cần thay đổi bảng ánh xạ bộ nhớ (memory mapping).
- Ví dụ: Tạo 100 thread trong Chrome nhẹ hơn chạy 100 Chrome process riêng.

### **How CPU switch (context switch) between processes/threads? How data is ensured safety?**

- **How CPU switches (Context Switch):**
    - **Context switch** là quá trình CPU chuyển từ thực thi process/thread này sang process/thread khác.
    - **Quy trình:**
        1. **Lưu trạng thái hiện tại:** CPU lưu Program Counter, registers, và trạng thái (stack pointer) của process/thread đang chạy vào một cấu trúc (Process Control Block - PCB cho process, Thread Control Block - TCB cho thread).
        2. **Chọn process/thread tiếp theo:** Scheduler (lập lịch) của kernel chọn process/thread khác từ hàng đợi (dựa trên ưu tiên, thời gian).
        3. **Tải trạng thái mới:** CPU tải PC, registers, và stack từ PCB/TCB của process/thread mới.
        4. **Thực thi:** CPU tiếp tục chạy từ lệnh được lưu.
    - **Process vs Thread:**
        - **Process switch:** Chậm hơn vì cần thay đổi bảng ánh xạ bộ nhớ (page table) để chuyển sang không gian địa chỉ khác.
        - **Thread switch:** Nhanh hơn vì thread trong cùng process dùng chung page table, chỉ cần đổi stack và registers.
    - **Single CPU Core:**
        - Chỉ một process/thread chạy tại một thời điểm.
        - Context switch xảy ra khi:
            - Hết time slice (preemptive multitasking).
            - Process/thread bị block (chờ I/O, sleep).
        - Ví dụ: Chrome (process) và Notepad (process) luân phiên chạy, hoặc nhiều tab (thread) trong Chrome.
    - **Multiple CPU Cores:**
        - Nhiều process/thread chạy đồng thời trên các core khác nhau.
        - Context switch vẫn xảy ra trong mỗi core để chia sẻ thời gian giữa các thread/process được gán cho core đó.
        - Ví dụ: Core 1 chạy thread tab 1 của Chrome, Core 2 chạy thread tab 2.
- **How data is ensured safety?**
    - **Process:**
        - **An toàn tự nhiên:** Mỗi process có không gian bộ nhớ riêng (do kernel quản lý qua page table). Process A không thể truy cập bộ nhớ của Process B → bảo vệ dữ liệu.
        - Kernel ngăn truy cập trái phép bằng cơ chế bảo vệ bộ nhớ (memory protection).
    - **Thread:**
        - **Không an toàn tự nhiên:** Các thread trong cùng process chia sẻ bộ nhớ → thread A có thể ghi đè dữ liệu của thread B nếu không cẩn thận.
        - **Đảm bảo an toàn:**
            - **Mutex/Lock:** Dùng cơ chế đồng bộ (synchronization) để ngăn nhiều thread truy cập cùng lúc vào dữ liệu chung (race condition).
            - **Thread-local storage:** Mỗi thread có vùng nhớ riêng cho dữ liệu nhạy cảm.
            - Ví dụ:

                ```c
                pthread_mutex_t lock;
                pthread_mutex_lock(&lock); // Khóa
                // Truy cập dữ liệu chung
                pthread_mutex_unlock(&lock); // Mở khóa
                ```

    - **Single Core:** Context switch do kernel kiểm soát, dữ liệu được lưu/tải chính xác qua PCB/TCB → an toàn giữa các process. Thread cần lock để tránh xung đột.
    - **Multiple Cores:** Nhiều thread chạy song song → nguy cơ race condition cao hơn. Cần lock hoặc atomic operations (như compare-and-swap) để bảo vệ dữ liệu chung.

### **What is multi-process and multi-thread? When should we use which one?**

- **Multi-process:**
    - **Là gì?** Một ứng dụng chạy dưới dạng nhiều process riêng biệt, mỗi process có không gian bộ nhớ và tài nguyên riêng (stack, heap, code, v.v.).
    - **Ví dụ:** Chrome chạy mỗi tab như một process riêng (Tab 1: Process 1, Tab 2: Process 2).
- **Multi-thread:**
    - **Là gì?** Một ứng dụng chạy nhiều thread trong cùng một process, các thread chia sẻ bộ nhớ và tài nguyên của process mẹ.
    - **Ví dụ:** Một game có thread chính (vẽ đồ họa), thread phụ (xử lý âm thanh) trong cùng process.
- **When to use which one?**


    | **Tiêu chí** | **Multi-process** | **Multi-thread** |
    | --- | --- | --- |
    | **Hiệu suất** | Nặng hơn (tốn RAM, context switch chậm) | Nhẹ hơn (chia sẻ tài nguyên, switch nhanh) |
    | **Tính an toàn** | Cao (cô lập bộ nhớ, crash 1 process không ảnh hưởng process khác) | Thấp hơn (thread crash có thể kéo cả process) |
    | **Giao tiếp** | Khó (IPC: pipe, socket, shared memory) | Dễ (truy cập bộ nhớ chung) |
    | **Song song** | Tốt trên multi-core (mỗi process 1 core) | Tốt trên multi-core (mỗi thread 1 core) |
    | **Dùng khi nào?** | - Ứng dụng cần cô lập (web browser). `<br>` - Tác vụ độc lập, nặng (video encoding). | - Tác vụ nhẹ, liên quan (game, server). `<br>` - Chia sẻ dữ liệu nhiều. |
- **Dùng multi-process khi:**
    - Cần độ ổn định cao (1 phần crash không làm cả hệ thống sập).
    - Tác vụ nặng, độc lập, tận dụng multi-core mà không cần chia sẻ dữ liệu nhiều.
    - Ví dụ: Chrome dùng multi-process để mỗi tab crash không ảnh hưởng tab khác.
- **Dùng multi-thread khi:**
    - Tác vụ nhẹ, cần chia sẻ dữ liệu nhanh (tránh overhead của IPC).
    - Ứng dụng đơn giản, cần tận dụng multi-core trong cùng ngữ cảnh.
    - Ví dụ: Server web (Nginx) dùng thread để xử lý nhiều request cùng lúc.

### **Process has how many states? How does it change between each state?**

- **Process states:** Một process thường có **5 trạng thái chính** (tùy hệ điều hành, có thể thêm trạng thái phụ):
    1. **New (Mới):** Process vừa được tạo, chưa sẵn sàng chạy.
    2. **Ready (Sẵn sàng):** Process đã được cấp tài nguyên, chờ CPU (nằm trong ready queue).
    3. **Running (Đang chạy):** Process đang thực thi trên CPU.
    4. **Waiting (Chờ):** Process bị block, chờ sự kiện (I/O, semaphore, v.v.).
    5. **Terminated (Kết thúc):** Process hoàn thành hoặc bị giết, tài nguyên được giải phóng.
- **How it changes:**
    - **New → Ready:** Kernel cấp tài nguyên (memory, file descriptors), process vào hàng đợi sẵn sàng.
    - **Ready → Running:** Scheduler chọn process từ ready queue, gán lên CPU.
    - **Running → Waiting:** Process cần I/O (đọc file, mạng) hoặc chờ tài nguyên → kernel chuyển sang waiting.
    - **Waiting → Ready:** Sự kiện hoàn tất (I/O xong) → process quay lại ready queue.
    - **Running → Ready:** Hết time slice (preemption) hoặc ưu tiên thấp hơn → quay lại hàng đợi.
    - **Running → Terminated:** Process hoàn thành (exit) hoặc bị kill.
- **Ví dụ:** Chrome mở tab (New) → cấp bộ nhớ (Ready) → tải trang (Running) → đợi server (Waiting) → nhận HTML (Ready) → hiển thị (Running) → đóng tab (Terminated).

### Scheduling algorithm

- **Scheduling algorithm** (thuật toán lập lịch) quyết định process/thread nào được chạy trên CPU và thứ tự:
    1. **First-Come, First-Served (FCFS):** Chạy theo thứ tự đến trước → đơn giản, nhưng không tối ưu (convoy effect).
    2. **Shortest Job First (SJF):** Ưu tiên process có thời gian chạy ngắn nhất → giảm thời gian chờ, nhưng cần biết trước thời gian.
    3. **Round Robin (RR):** Chia đều time slice (ví dụ: 10ms) cho mỗi process → công bằng, phổ biến trong hệ điều hành hiện đại.
    4. **Priority Scheduling:** Ưu tiên process có độ ưu tiên cao hơn → có thể gây starvation (process thấp bị bỏ đói).
    5. **Multi-Level Queue:** Chia process thành nhiều hàng đợi (hệ thống, ứng dụng) → mỗi queue dùng thuật toán riêng.
    6. **Completely Fair Scheduler (CFS - Linux):** Cân bằng "công bằng" thời gian CPU dựa trên vruntime (thời gian ảo) → tối ưu multi-core.
- **Ví dụ:** Chrome (ưu tiên cao) chạy trước Notepad (ưu tiên thấp) trong Priority Scheduling.

### What will happen if a process is waiting? Or a thread is sleeping?

- **Process waiting:**
    - **Hiện tượng:** Process chuyển sang trạng thái **Waiting** khi cần tài nguyên ngoài CPU (I/O, mạng, semaphore).
    - **Kết quả:**
        - Kernel tạm dừng process, đưa ra khỏi CPU, vào waiting queue.
        - CPU chạy process khác trong ready queue.
    - **Ví dụ:** Process đợi đọc file → Waiting → file sẵn sàng → Ready → Running.
- **Thread sleeping:**
    - **Hiện tượng:** Thread gọi hàm sleep() (như sleep(5) trong C) để tạm dừng một thời gian.
    - **Kết quả:**
        - Thread chuyển sang trạng thái **Waiting** (hoặc trạng thái tương tự tùy hệ điều hành).
        - Không chiếm CPU, scheduler chạy thread/process khác.
        - Sau thời gian sleep, thread quay lại **Ready**.
    - **Ví dụ:** Thread tải ảnh sleep 2 giây → Waiting → hết 2 giây → Ready → Running.

### **How CPU detects that a thread is sleeping? Or detect when it wants to run?**

- **Detect thread sleeping:**
    - **Cách phát hiện:**
        - Thread tự báo cho kernel qua system call như sleep() hoặc nanosleep().
        - Kernel đặt timer cho thread (dùng interrupt hoặc clock) và chuyển thread sang **Waiting**.
    - **Cơ chế:**
        - Không phải CPU "phát hiện", mà kernel quản lý trạng thái thread trong TCB (Thread Control Block).
        - Thread không chạy, CPU được giải phóng.
- **Detect when it wants to run:**
    - **Cách phát hiện:**
        - Khi timer hết (sleep kết thúc) hoặc sự kiện xảy ra (I/O hoàn tất):
            - Hardware interrupt (timer, I/O device) thông báo kernel.
            - Kernel kiểm tra TCB, thấy thread sẵn sàng → chuyển sang **Ready**.
        - Scheduler đưa thread vào ready queue, chờ CPU.
    - **Ví dụ:**
        - Thread sleep 5 giây → kernel đặt timer → timer bắn interrupt sau 5 giây → thread vào Ready.

## What is `thread-pool`? How to use it? Describe how to create a `thread-pool` in your programming language.

- **Thread pool** là một tập hợp các thread được tạo sẵn và quản lý để thực thi các tác vụ (tasks) thay vì tạo mới thread mỗi khi cần.
- **Ý tưởng:** Thay vì tạo và hủy thread liên tục (tốn tài nguyên CPU và RAM), thread pool giữ một số thread "sống" (idle) trong bộ nhớ, sẵn sàng nhận việc khi có yêu cầu.
- **Cách hoạt động:**
    1. Khởi tạo một số lượng thread cố định (ví dụ: 5 thread).
    2. Các thread này chờ trong pool, không làm gì cho đến khi có tác vụ.
    3. Khi có task (như xử lý request, tính toán), một thread từ pool được gán để chạy task.
    4. Sau khi hoàn thành, thread quay lại pool, chờ task tiếp theo.
- **Ví dụ thực tế:** Web server dùng thread pool để xử lý nhiều request từ client cùng lúc mà không cần tạo thread mới mỗi lần.

---

### **How to use a Thread Pool?**

- **Khi nào dùng?**
    - Xử lý nhiều tác vụ ngắn (short-lived tasks) đồng thời (như tải nhiều URL, xử lý request).
    - Tránh overhead của việc tạo/hủy thread lặp đi lặp lại.
    - Giới hạn số lượng thread để tránh quá tải CPU (ví dụ: máy 4 core không nên tạo 1000 thread).
- **Lợi ích:**
    - **Hiệu suất:** Giảm thời gian tạo thread (thread creation overhead).
    - **Kiểm soát:** Giới hạn số thread tối đa, tránh tiêu tốn tài nguyên.
    - **Tái sử dụng:** Thread được dùng lại, không cần hủy/tạo mới.
- **Nhược điểm:**
    - Nếu pool quá nhỏ, task phải đợi (queueing delay).
    - Nếu pool quá lớn, vẫn có thể gây tranh chấp CPU/RAM.

### Describe how to create a Thread Pool in Golang

- Trong Go, "Thread Pool" không chính xác là pool của thread (vì `goroutines` nhẹ hơn thread OS), mà là một cơ chế để quản lý số lượng `goroutines` chạy đồng thời, tránh tạo quá nhiều `goroutines` gây tốn tài nguyên.
- **Ý tưởng:** Tạo một nhóm `goroutines` cố định, dùng kênh (channel) để gửi task vào, các `goroutines` trong pool sẽ lấy task từ kênh và xử lý.
- **Tại sao cần?**
    - `Goroutines` rất nhẹ (chỉ vài KB), nhưng nếu tạo hàng triệu `goroutines` (ví dụ: cho mỗi request), vẫn có thể gây quá tải CPU hoặc bộ nhớ.
    - Thread pool giúp giới hạn số lượng worker, tối ưu hiệu suất.

---

- **Các thành phần chính:**
    1. **Channel:** Làm hàng đợi (queue) để chứa task.
    2. **Worker Goroutines:** Một số lượng cố định `goroutines` nhận task từ channel và thực thi.
    3. **Task:** Công việc cần chạy (thường là một hàm).
- **Bước thực hiện:**
    1. Tạo một channel để gửi task.
    2. Khởi chạy một số lượng worker `goroutines` cố định, mỗi worker lấy task từ channel.
    3. Gửi task vào channel từ hàm chính.
    4. (Tùy chọn) Đợi tất cả task hoàn thành bằng `sync.WaitGroup`.
- Ví dụ code: Thread Pool trong Golang

    ```go
    package main
    
    import (
    	"fmt"
    	"sync"
    	"time"
    )
    
    // Task là một hàm đại diện cho công việc cần thực thi
    type Task func()
    
    // ThreadPool là cấu trúc quản lý pool
    type ThreadPool struct {
    	workers int          // Số worker (goroutines)
    	tasks   chan Task    // Kênh chứa task
    	wg      sync.WaitGroup // Đợi tất cả task hoàn thành
    }
    
    // NewThreadPool tạo một thread pool mới
    func NewThreadPool(numWorkers int) *ThreadPool {
    	return &ThreadPool{
    		workers: numWorkers,
    		tasks:   make(chan Task),
    	}
    }
    
    // Start khởi động các worker
    func (tp *ThreadPool) Start() {
    	for i := 0; i < tp.workers; i++ {
    		go func(workerID int) {
    			for task := range tp.tasks { // Lấy task từ channel
    				fmt.Printf("Worker %d starting task\n", workerID)
    				task() // Thực thi task
    				fmt.Printf("Worker %d finished task\n", workerID)
    			}
    		}(i)
    	}
    }
    
    // AddTask thêm task vào pool
    func (tp *ThreadPool) AddTask(task Task) {
    	tp.wg.Add(1)       // Tăng bộ đếm WaitGroup
    	tp.tasks <- task   // Gửi task vào channel
    }
    
    // Wait đợi tất cả task hoàn thành
    func (tp *ThreadPool) Wait() {
    	tp.wg.Wait()       // Chờ WaitGroup về 0
    }
    
    // Stop đóng channel để dừng pool
    func (tp *ThreadPool) Stop() {
    	close(tp.tasks)    // Đóng channel
    }
    
    func main() {
    	// Tạo thread pool với 3 worker
    	pool := NewThreadPool(3)
    	pool.Start()
    
    	// Tạo 5 task giả lập
    	for i := 0; i < 5; i++ {
    		taskID := i
    		pool.AddTask(func() {
    			fmt.Printf("Task %d is running\n", taskID)
    			time.Sleep(2 * time.Second) // Giả lập công việc tốn thời gian
    			fmt.Printf("Task %d is done\n", taskID)
    			pool.wg.Done() // Giảm bộ đếm WaitGroup
    		})
    	}
    
    	// Đợi tất cả task hoàn thành
    	pool.Wait()
    
    	// Dừng pool
    	pool.Stop()
    
    	fmt.Println("All tasks completed")
    }
    ```

- **Giải thích:**
    - 3 worker chạy 3 task đầu (0, 1, 2) cùng lúc.
    - Khi task 0 xong, worker 0 lấy task 3.
    - Khi task 1 xong, worker 1 lấy task 4.
    - Tổng thời gian ~4 giây (2 đợt, mỗi đợt 2 giây).
- **Tóm tắt**
    - **Thread Pool trong Go:** Giới hạn số `goroutines` bằng channel và worker.
    - **Triển khai:** Dùng channel làm queue, `goroutines` làm worker, WaitGroup để đồng bộ.
    - **Ưu điểm:** Đơn giản, hiệu quả, tận dụng concurrency của Go.

## Can 2 different processes access or change data of each other `address space`?

- **Câu trả lời ngắn gọn:** Không, theo mặc định, hai process khác nhau không thể truy cập hay thay đổi không gian địa chỉ (address space) của nhau. Nhưng có ngoại lệ nếu dùng cơ chế đặc biệt.
- **Giải thích:**
    - **Virtual Memory (Bộ nhớ ảo):**
        - Mỗi process có không gian địa chỉ ảo riêng, được kernel quản lý qua **page table**.
        - Ví dụ: Process A thấy địa chỉ `0x1000`, Process B cũng thấy `0x1000`, nhưng chúng ánh xạ đến vùng RAM khác nhau (hoặc swap).
        - Kernel đảm bảo cô lập bằng cơ chế **memory protection**: Process A không có quyền truy cập page table của Process B.
    - **Tại sao không thể truy cập?**
        - CPU kiểm tra quyền truy cập qua **MMU (Memory Management Unit)**. Nếu Process A cố đọc/ghi địa chỉ của Process B, MMU gây lỗi (segmentation fault), kernel chặn lại.
    - **Ngoại lệ (có thể truy cập):**
        - **Inter-Process Communication (IPC):**
            - **Shared Memory:** Hai process có thể chia sẻ một vùng bộ nhớ chung nếu dùng `shmget()` (Linux) hoặc `CreateSharedMemory` (Windows). Kernel cấp vùng nhớ chung, ánh xạ vào address space của cả hai.
            - **Pipes/Sockets:** Dữ liệu được truyền qua kernel, không truy cập trực tiếp address space.
        - **Ptrace (Process Tracing):** Công cụ như debugger dùng `ptrace` để đọc/ghi bộ nhớ của process khác.
        - **Kernel Exploit:** Nếu có lỗ hổng kernel, process có thể vượt qua memory protection (hiếm, bất hợp pháp).
- **Tóm lại:** Mặc định không thể, nhưng dùng IPC hoặc công cụ đặc biệt thì được.

---

### **Can 2 processes use the same library (e.g., libc is required for every process)? How?**

- **Câu trả lời ngắn:** Có, hai process có thể dùng cùng thư viện (như `libc`), và hệ điều hành tối ưu bằng cách chia sẻ mã lệnh trong RAM.
- **Giải thích:**
    - **Thư viện là gì?**
        - `libc` (C standard library) chứa các hàm cơ bản như `printf()`, `malloc()`, cần thiết cho hầu hết chương trình C.
    - **Cách chia sẻ:**
        - **Dynamic Linking:**
            - Khi process được nạp (loaded), hệ điều hành dùng **dynamic linker** (như `ld.so` trên Linux) để liên kết với thư viện động (`.so` hoặc `.dll`).
            - Thay vì sao chép toàn bộ mã `libc` vào address space của mỗi process, kernel ánh xạ cùng một bản sao vật lý của `libc` (trong RAM) vào không gian địa chỉ ảo của nhiều process.
        - **Shared Memory Pages:**
            - `libc` được lưu trong RAM dưới dạng **read-only pages** (mã lệnh không thay đổi).
            - Mỗi process thấy libc tại địa chỉ ảo riêng (ví dụ: Process A: `0x7000`, Process B: `0x8000`), nhưng chúng trỏ đến cùng vùng RAM vật lý → tiết kiệm bộ nhớ.
    - **Cơ chế:**
        - File `libc.so` được nạp một lần vào RAM khi process đầu tiên cần nó.
        - Process sau dùng cùng bản sao qua **page table mapping**, chỉ tạo bản sao riêng cho dữ liệu riêng tư (như biến nội bộ của `libc`).
    - **Ví dụ:**
        - Chrome và Notepad đều dùng `libc`. Hệ điều hành nạp `libc.so` vào RAM một lần, cả hai process ánh xạ đến đó.
- **Tóm lại:** Có, nhờ dynamic linking và shared memory pages, thư viện được chia sẻ hiệu quả giữa các process.

### **How does debugger work? How it can attach to a running process and change data of that process?**

- **Câu trả lời ngắn:** Debugger dùng cơ chế đặc biệt (như `ptrace` trên Linux) để gắn vào process, đọc/ghi bộ nhớ, và điều khiển thực thi. Đúng là rất cool!
- **Giải thích:**
    - **Debugger là gì?** Công cụ như `gdb` (GNU Debugger) giúp theo dõi, sửa lỗi chương trình bằng cách kiểm soát process.
    - **Cách hoạt động:**
        1. **Attach vào process:**
            - Debugger dùng system call `ptrace` (Linux) hoặc `DebugActiveProcess` (Windows) để gắn vào process đang chạy.
            - `ptrace(PTRACE_ATTACH, pid)`: Kernel tạm dừng process mục tiêu (target process), cho phép debugger kiểm soát.
            - Process bị gắn vào trạng thái **stopped**, chờ lệnh từ debugger.
        2. **Đọc/ghi bộ nhớ:**
            - Debugger dùng `ptrace(PTRACE_PEEKDATA)` để đọc dữ liệu từ address space của process.
            - Dùng `ptrace(PTRACE_POKEDATA)` để ghi dữ liệu vào địa chỉ cụ thể.
            - Ví dụ: Thay đổi biến `int x = 5` thành `x = 10` bằng cách ghi trực tiếp vào địa chỉ của `x`.
        3. **Điều khiển thực thi:**
            - **Breakpoint:** Debugger chèn lệnh `int 3` (breakpoint interrupt) vào mã lệnh → CPU dừng khi chạy đến đó.
            - **Step:** Dùng `ptrace(PTRACE_SINGLESTEP)` để chạy từng lệnh, theo dõi trạng thái (registers, PC).
            - **Resume:** Dùng `ptrace(PTRACE_CONT)` để tiếp tục chạy process.
        4. **Truy cập dữ liệu:**
            - Debugger đọc thông tin từ **Process Control Block (PCB)** của process (PC, registers, stack).
            - Vì debugger chạy với quyền cao hơn (thường root hoặc cùng user), kernel cho phép vượt qua memory protection.
    - **Ví dụ:**
        - Bạn chạy `gdb -p 1234` (PID của Chrome).
        - **Gdb** gắn vào, dừng Chrome → đọc giá trị biến → thay đổi → tiếp tục chạy.
    - **Tại sao có thể thay đổi dữ liệu?**
        - `ptrace` là cơ chế kernel cung cấp cho debugging, cho phép truy cập address space của process khác nếu có quyền.
        - Debugger không vi phạm memory protection mà dùng "cửa hậu" hợp pháp của hệ điều hành.
- **Cool vì** có thể "hack" process đang chạy, xem/chỉnh sửa mọi thứ (biến, mã lệnh) mà không cần source code.
- **Tóm lại** debugger gắn vào process qua `ptrace`, đọc/ghi bộ nhớ, điều khiển thực thi bằng system call đặc biệt.

## How 2 processes can communicate with each other?

| **Phương pháp** | **Hướng dữ liệu** | **Đồng bộ** | **Ví dụ Golang** |
| --- | --- | --- | --- |
| **Pipes** | Một chiều | Có | `os.Pipe()` |
| **Shared Memory** | Hai chiều | Không | `unix.ShmOpen()` |
| **Message Queues** | Hai chiều | Có | Mô phỏng qua file (CGO đầy đủ) |
| **Sockets** | Hai chiều | Có | `net.Listen("unix")` |
| **Signals** | Không dữ liệu | Không | `os/signal.Notify()` |

### **Pipes (Ống dẫn)**

- Pipes cho phép truyền dữ liệu một chiều giữa hai process, thường dùng giữa process cha và con. Trong Go, ta dùng `os.Pipe()` để tạo anonymous pipe.
- **Cách hoạt động:** OS tạo buffer trong kernel, process ghi vào pipe, process khác đọc từ đó.
- **Ví dụ Golang:**

    ```go
    package main
    
    import (
    	"fmt"
    	"io"
    	"os"
    )
    
    func main() {
    	r, w, _ := os.Pipe() // Tạo pipe: r để đọc, w để ghi
    
    	if pid, _ := os.Fork(); pid == 0 { // Child process
    		w.Close() // Đóng đầu ghi trong child
    		buf := make([]byte, 100)
    		n, _ := r.Read(buf)
    		fmt.Printf("Child received: %s\n", buf[:n])
    		os.Exit(0)
    	} else { // Parent process
    		r.Close() // Đóng đầu đọc trong parent
    		w.Write([]byte("Hello from parent"))
    		w.Close()
    		os.Wait() // Đợi child hoàn thành
    	}
    }
    ```

    - **Output:** `Child received: Hello from parent`
    - **Giải thích:** Parent ghi "Hello" vào pipe, child đọc từ pipe và in ra.
    - **Khi nào dùng?** Truyền dữ liệu đơn giản giữa process liên quan.

### **Shared Memory (Bộ nhớ chia sẻ)**

- Hai process chia sẻ một vùng bộ nhớ chung để đọc/ghi trực tiếp. Trong Go, ta dùng package `golang.org/x/sys/unix` để gọi POSIX shared memory.
- **Cách hoạt động:** Kernel cấp vùng nhớ, ánh xạ vào address space của cả hai process.
- **Ví dụ Golang:**

    ```go
    package main
    
    import (
    	"fmt"
    	"golang.org/x/sys/unix"
    	"os"
    )
    
    func main() {
    	// Tạo shared memory
    	shmFd, _ := unix.ShmOpen("/myshm", os.O_CREATE|os.O_RDWR, 0666)
    	defer unix.ShmUnlink("/myshm")
    	unix.Ftruncate(shmFd, 4096) // Đặt kích thước 4KB
    
    	// Ánh xạ vào bộ nhớ
    	ptr, _ := unix.Mmap(shmFd, 0, 4096, unix.PROT_WRITE|unix.PROT_READ, unix.MAP_SHARED)
    
    	if pid, _ := os.Fork(); pid == 0 { // Child
    		copy(ptr, []byte("Hello from child"))
    		unix.Munmap(ptr)
    		os.Exit(0)
    	} else { // Parent
    		os.Wait() // Đợi child ghi
    		fmt.Printf("Parent read: %s\n", string(ptr))
    		unix.Munmap(ptr)
    	}
    }
    ```

    - **Output:** `Parent read: Hello from child`
    - **Giải thích:** Child ghi "Hello" vào shared memory, parent đọc sau khi child xong.
    - **Lưu ý:** Cần cài `golang.org/x/sys` (`go get golang.org/x/sys`).
    - **Khi nào dùng?** Truyền dữ liệu lớn, nhanh, cần đồng bộ thêm (ở đây đơn giản hóa, không có lock).

### **Message Queues (Hàng đợi tin nhắn)**

- Gửi/nhận tin nhắn qua hàng đợi do kernel quản lý.
- Go không có thư viện POSIX message queue chuẩn, ta phải dùng CGO hoặc mô phỏng bằng channel + shared memory.
- **Mô phỏng bằng file (đơn giản hóa):**

    ```go
    package main
    
    import (
    	"fmt"
    	"os"
    	"time"
    )
    
    func main() {
    	file := "/tmp/myqueue"
    	if pid, _ := os.Fork(); pid == 0 { // Child
    		time.Sleep(1 * time.Second) // Đợi parent tạo file
    		data, _ := os.ReadFile(file)
    		fmt.Printf("Child received: %s\n", data)
    		os.Remove(file)
    		os.Exit(0)
    	} else { // Parent
    		os.WriteFile(file, []byte("Hello"), 0666)
    		os.Wait()
    	}
    }
    ```

    - **Output:** `Child received: Hello`
    - **Giải thích:** Parent ghi tin nhắn vào file, child đọc từ file. Đây là mô phỏng đơn giản, thực tế dùng `mq_open` qua CGO sẽ phức tạp hơn.
    - **Khi nào dùng?** Truyền tin nhắn nhỏ, không liên quan trực tiếp.

### **Sockets (Unix Domain Sockets)**

- Sockets cho phép giao tiếp hai chiều trong cùng máy (Unix Domain Socket).
- Go hỗ trợ qua package `net`.
- **Ví dụ Golang:**

    ```go
    package main
    
    import (
    	"fmt"
    	"net"
    	"os"
    )
    
    func main() {
    	sockPath := "/tmp/mysock"
    	if pid, _ := os.Fork(); pid == 0 { // Child (client)
    		conn, _ := net.Dial("unix", sockPath)
    		conn.Write([]byte("Hello from child"))
    		conn.Close()
    		os.Exit(0)
    	} else { // Parent (server)
    		listener, _ := net.Listen("unix", sockPath)
    		defer os.Remove(sockPath)
    		conn, _ := listener.Accept()
    		buf := make([]byte, 100)
    		n, _ := conn.Read(buf)
    		fmt.Printf("Parent received: %s\n", buf[:n])
    		conn.Close()
    		os.Wait()
    	}
    }
    ```

    - **Output:** `Parent received: Hello from child`
    - **Giải thích:** Parent tạo server socket, child kết nối và gửi "Hello".
    - **Khi nào dùng?** Giao tiếp hai chiều, linh hoạt.

### **Signals (Tín hiệu)**

- Gửi thông báo sự kiện từ process này sang process khác.
- Go hỗ trợ qua `os/signal`.
- **Ví dụ Golang:**

    ```go
    package main
    
    import (
    	"fmt"
    	"os"
    	"os/signal"
    	"syscall"
    )
    
    func main() {
    	sigs := make(chan os.Signal, 1)
    	signal.Notify(sigs, syscall.SIGUSR1)
    
    	if pid, _ := os.Fork(); pid == 0 { // Child
    		parentPid := os.Getppid()
    		syscall.Kill(parentPid, syscall.SIGUSR1)
    		os.Exit(0)
    	} else { // Parent
    		sig := <-sigs // Chờ signal
    		fmt.Println("Parent received signal:", sig)
    		os.Wait()
    	}
    }
    ```

    - **Output:** `Parent received signal: SIGUSR1`
    - **Giải thích:** Child gửi signal `SIGUSR1` đến parent, parent nhận và in ra.
    - **Khi nào dùng?** Thông báo sự kiện, không truyền dữ liệu lớn.

## **What is a child-process? How to create a child-process?**

- **Child process là gì?**
    - Child process là một process được tạo ra từ một process khác (gọi là **parent process**) trong hệ điều hành.
    - Nó là một bản sao của parent process tại thời điểm tạo, nhưng chạy độc lập với mã lệnh và trạng thái riêng.
- **Cách tạo child process:**
    - Trong Linux/Unix, dùng system call **fork()** để tạo child process.
    - Trong các ngôn ngữ lập trình, ta gọi fork() trực tiếp (C) hoặc qua thư viện (như os.Fork() trong Go).
- **Ví dụ tạo child process trong Golang:**

    ```go
    package main
    
    import (
    	"fmt"
    	"os"
    )
    
    func main() {
    	pid, err := os.Fork()
    	if err != nil {
    		fmt.Println("Fork failed:", err)
    		return
    	}
    	if pid == 0 {
    		fmt.Printf("Child PID: %d\n", os.Getpid())
    	} else {
    		fmt.Printf("Parent, child PID: %d\n", pid)
    		os.Wait()
    	}
    }
    ```


---

### **What data a child-process have when we create it?**

- Khi tạo bằng `fork()`:
    - Child process là **bản sao** của parent process tại thời điểm gọi fork().
    - Nó kế thừa hầu hết dữ liệu và trạng thái của parent, bao gồm:
        1. **Code Segment:** Mã lệnh của chương trình (giống parent).
        2. **Data Segment:** Biến toàn cục và dữ liệu tĩnh (giống parent).
        3. **Heap:** Bộ nhớ động đã cấp phát (giống parent).
        4. **Stack:** Biến cục bộ và call stack (giống parent).
        5. **Registers:** Giá trị thanh ghi (PC, SP, v.v.) giống parent.
        6. **File Descriptors:** Các file/socket đang mở (giống parent).
        7. **Virtual Memory:** Không gian địa chỉ ảo giống parent (nhưng ánh xạ riêng nhờ COW - xem bên dưới).
- **Khác biệt:**
    - **PID:** Child có PID riêng (khác parent).
    - **PPID:** Parent PID của child là PID của parent.
    - Sau `fork()`, child và parent chạy độc lập, thay đổi không ảnh hưởng lẫn nhau (trừ khi dùng IPC).
- **Ví dụ:**
    - Parent có biến `int x = 5` trong data segment → child cũng có `x = 5` lúc tạo.

### **Can it read/write data on its parent process?**

- **Câu trả lời ngắn:** Không trực tiếp, vì child và parent có không gian bộ nhớ ảo riêng (do virtual memory). Nhưng có thể qua **IPC**.
- **Giải thích:**
    - Sau `fork()`, child nhận bản sao dữ liệu của parent, nhưng chúng nằm trong **address space riêng**.
    - Kernel dùng **memory protection** để ngăn child truy cập bộ nhớ của parent và ngược lại.
    - Muốn đọc/ghi dữ liệu của nhau, phải dùng cơ chế IPC như:
        - **Shared Memory:** Chia sẻ vùng nhớ chung.
        - **Pipes/Sockets:** Truyền dữ liệu qua kernel.
        - **Files:** Ghi/đọc qua file hệ thống.
- **Ví dụ Shared Memory trong Go:**

    ```go
    package main
    
    import (
    	"fmt"
    	"golang.org/x/sys/unix"
    	"os"
    )
    
    func main() {
    	shmFd, _ := unix.ShmOpen("/myshm", os.O_CREATE|os.O_RDWR, 0666)
    	defer unix.ShmUnlink("/myshm")
    	unix.Ftruncate(shmFd, 4096)
    	ptr, _ := unix.Mmap(shmFd, 0, 4096, unix.PROT_WRITE|unix.PROT_READ, unix.MAP_SHARED)
    
    	if pid, _ := os.Fork(); pid == 0 { // Child
    		copy(ptr, []byte("Hello from child"))
    		unix.Munmap(ptr)
    	} else { // Parent
    		os.Wait()
    		fmt.Printf("Parent read: %s\n", string(ptr))
    		unix.Munmap(ptr)
    	}
    }
    ```


### **What is Copy on Write (COW)?**

- **Là gì?**
    - **Copy on Write (COW)** là kỹ thuật tối ưu trong OS khi tạo child process bằng `fork()`.
    - Thay vì sao chép toàn bộ bộ nhớ của parent ngay lập tức (tốn tài nguyên), kernel để child và parent **chia sẻ cùng vùng nhớ vật lý** ban đầu, nhưng đánh dấu là **read-only**.
    - Khi một trong hai (child hoặc parent) cố ghi (write), kernel mới sao chép vùng nhớ đó và cấp bản sao riêng.
- **Cách hoạt động:**
    1. Sau `fork()`, child và parent dùng chung page RAM (qua page table).
    2. Nếu chỉ đọc, không sao chép → tiết kiệm RAM.
    3. Nếu ghi (write), MMU gây lỗi (page fault), kernel sao chép page và cấp bản sao riêng.
- **Ví dụ:**
    - Parent có biến `x = 5` trong page 4KB.
    - Child cũng thấy `x = 5` trong cùng page (read-only).
    - Child ghi `x = 10` → kernel sao chép page, child có `x = 10`, parent giữ `x = 5`.
- **Dirty COW (liên quan security):** Là lỗ hổng kernel Linux (2016), khai thác COW để ghi vào file read-only bằng cách lợi dụng race condition trong `madvise()` và `write()`. Kết quả: leo thang quyền (fabulous thật!).
- **Khi nào dùng?** Tối ưu tài nguyên khi tạo process.

### What will happen when child-process changes a variable of parent process?

- **Câu trả lời ngắn:** Không ảnh hưởng trực tiếp, vì child không thay đổi được biến của parent (do COW).
- **Giải thích:**
    - Sau `fork()`, biến của parent được sao chép qua COW.
    - Nếu child thay đổi biến: Kernel tạo bản sao riêng cho child → parent không bị ảnh hưởng.
    - Muốn thay đổi biến của parent, child phải dùng IPC (như shared memory).
- **Ví dụ:**

    ```c
    #include <unistd.h>
    #include <stdio.h>
    int x = 5;
    int main() {
        if (fork() == 0) { // Child
            x = 10;
            printf("Child: x = %d\n", x);
        } else { // Parent
            sleep(1);
            printf("Parent: x = %d\n", x);
        }
        return 0;
    }
    ```

  Output

    ```
    Child: x = 10
    Parent: x = 5
    ```


### **If file descriptor also be inherited by the child process, what if 2 processes handle the same file descriptor or socket?**

- **Câu trả lời ngắn:** Có, file descriptor (FD) được kế thừa. Cả hai process có thể dùng cùng FD, nhưng cần cẩn thận vì chúng chia sẻ trạng thái.
- **Giải thích:**
    - Sau `fork()`, child kế thừa bảng FD của parent (mở file, socket, v.v.).
    - FD trỏ đến cùng **file description** trong kernel (chứa offset, trạng thái) → cả hai process ảnh hưởng lẫn nhau.
- **Ví dụ với file:**

    ```c
    #include <unistd.h>
    #include <fcntl.h>
    #include <stdio.h>
    int main() {
        int fd = open("test.txt", O_RDWR | O_CREAT, 0666);
        write(fd, "Start", 5);
        if (fork() == 0) { // Child
            write(fd, "Child", 5);
        } else { // Parent
            sleep(1);
            write(fd, "Parent", 6);
            close(fd);
        }
        return 0;
    }
    ```

    - **Output trong test.txt:** `StartChildParent`
    - **Giải thích:** Cả child và parent ghi vào cùng FD, offset tăng dần.
    - **Với socket:**
        - Nếu FD là socket (như TCP), cả hai có thể gửi/nhận dữ liệu qua cùng kết nối.
        - Tham khảo [Perl Cookbook](https://www.cs.ait.ac.th/~on/O/oreilly/perl/cookbook/ch17_10.htm): Hai process dùng cùng socket cần phối hợp (ví dụ: child đọc, parent ghi).
    - **Vấn đề:**
        - **Race condition:** Nếu cả hai cùng ghi, dữ liệu có thể lẫn lộn.
        - **Đóng FD:** Nếu child đóng FD, parent vẫn dùng được (vì FD tham chiếu file description, chỉ hết khi tất cả FD đóng).
    - **Giải pháp:** Dùng IPC (pipe, semaphore) để đồng bộ.

## Concurrency vs Parallels? (in case single CPU core and multiple CPU cores)

- **Concurrency (Đồng thời):**
    - **Concurrency** là khả năng xử lý nhiều tác vụ (tasks) cùng lúc, nhưng không nhất thiết phải chạy đồng thời thực sự. Nó tập trung vào việc **quản lý nhiều tác vụ** sao cho chúng có vẻ chạy cùng lúc.
    - **Single CPU Core:**
        - Với 1 core, concurrency đạt được qua **context switching**: CPU luân phiên chạy từng thread/process trong khoảng thời gian ngắn (time slice).
        - Ví dụ: Thread A chạy 10ms, rồi Thread B chạy 10ms → trông như cả hai chạy cùng lúc.
    - **Multiple CPU Cores:**
        - Concurrency vẫn áp dụng, nhưng một số tác vụ có thể chạy song song thật sự (xem parallelism).
    - **Ví dụ:** Web server xử lý nhiều request cùng lúc, dù chỉ có 1 core.
- **Parallelism (Song song):**
    - **Parallelism** là khi nhiều tác vụ chạy **đồng thời thực sự** trên các đơn vị xử lý khác nhau (nhiều core hoặc CPU).
    - **Single CPU Core:**
        - Không có parallelism thật sự, vì chỉ 1 core xử lý 1 thread/process tại một thời điểm.
    - **Multiple CPU Cores:**
        - Parallelism xảy ra khi mỗi core chạy một thread/process độc lập cùng lúc.
        - Ví dụ: Core 1 chạy Thread A, Core 2 chạy Thread B → cả hai thực thi song song.
    - **Ví dụ:** Tính toán ma trận lớn, mỗi core xử lý một phần.
- **So sánh:**


    | **Tiêu chí** | **Concurrency** | **Parallelism** |
    | --- | --- | --- |
    | **Mục tiêu** | Quản lý nhiều task | Chạy nhiều task cùng lúc |
    | **Single Core** | Có (context switch) | Không |
    | **Multiple Cores** | Có (kết hợp với parallelism) | Có (chạy thực sự song song) |
    | **Ví dụ** | Web server đa luồng | Tính toán song song (GPU, CPU) |
- **Tóm lại:** Concurrency là "ảo", parallelism là "thật". Với 1 core, chỉ có concurrency; với nhiều core, có thể cả hai.

### What is Critical Zone?

- **Critical Zone** (hay Critical Section) là đoạn mã trong chương trình mà nhiều thread/process truy cập vào **dữ liệu chung** (shared resource), và cần được bảo vệ để tránh xung đột.
- **Tại sao cần?** Nếu nhiều thread cùng thay đổi dữ liệu chung mà không đồng bộ, sẽ xảy ra lỗi (race condition).
- **Ví dụ:**

    ```c
    int counter = 0;
    void increment() {
        counter++; // Critical zone
    }
    ```

  Nếu 2 thread cùng chạy `increment()`, counter có thể không tăng đúng (race condition).


### What is Race Condition and How to Handle This Case?

- **Race Condition là gì?**
    - Là lỗi xảy ra khi nhiều thread/process truy cập và thay đổi dữ liệu chung cùng lúc, dẫn đến kết quả không dự đoán được.
    - Xảy ra khi:
        1. Có **critical zone**.
        2. Không có đồng bộ (synchronization).
- **Ví dụ:**
    - Thread 1: Đọc `counter = 0`, tăng thành 1.
    - Thread 2: Đọc `counter = 0` (trước khi Thread 1 ghi), tăng thành 1.
    - Kết quả: `counter = 1` (thay vì 2).
- **Cách xử lý:**
    1. **Dùng khóa (Locking):** Đảm bảo chỉ 1 thread truy cập critical zone tại một thời điểm.
    2. **Atomic Operations:** Dùng lệnh CPU nguyên tử (như `atomic.AddInt32` trong Go).
    3. **Tránh chia sẻ dữ liệu:** Mỗi thread dùng dữ liệu riêng.
- **Ví dụ dùng Mutex trong Go:**

    ```go
    package main
    
    import (
    	"fmt"
    	"sync"
    )
    
    var counter int
    var mutex sync.Mutex
    
    func increment(wg *sync.WaitGroup) {
    	defer wg.Done()
    	mutex.Lock()   // Khóa
    	counter++      // Critical zone
    	mutex.Unlock() // Mở khóa
    }
    
    func main() {
    	var wg sync.WaitGroup
    	for i := 0; i < 100; i++ {
    		wg.Add(1)
    		go increment(&wg)
    	}
    	wg.Wait()
    	fmt.Println("Counter:", counter) // Luôn là 100
    }
    ```


### **What is Locking Mechanism? Mutex? Semaphore? Spinlock? Read Lock vs Write Lock?**

**Locking Mechanism (Cơ chế khóa):** Là cách bảo vệ critical zone, đảm bảo chỉ một thread/process truy cập tài nguyên chung tại một thời điểm. Có các cơ chế khoá sau:

- **Mutex (Mutual Exclusion):**
    - Là khóa chỉ cho phép 1 thread vào critical zone, các thread khác đợi.
    - **Cách dùng:** Lock trước khi vào, unlock khi ra.
    - **Ví dụ:** Xem code Go ở trên.
- **Semaphore:**
    - Là khóa đếm (counting lock), cho phép một số lượng thread giới hạn truy cập tài nguyên.
    - **Cách hoạt động:**
        - Giá trị ban đầu (count) là số thread tối đa.
        - `Wait()` giảm count, `Signal()` tăng count.
    - **Ví dụ:** Giới hạn 5 thread truy cập DB:

        ```go
        var sem = make(chan struct{}, 5) // Semaphore với 5 slot
        
        func accessDB() {
        	sem <- struct{}{} // Giảm slot (lock)
        	// Critical zone
        	<-sem             // Tăng slot (unlock)
        }
        ```

- **Spinlock:**
    - Là khóa vòng lặp, thread đợi bằng cách lặp liên tục (busy-wait) thay vì sleep.
    - **Cách hoạt động:** Nếu khóa bị chiếm, thread "quay vòng" kiểm tra đến khi khóa mở.
    - **Ví dụ trong C:**

        ```c
        int lock = 0;
        while (__sync_lock_test_and_set(&lock, 1)) {} // Spinlock
        // Critical zone
        __sync_lock_release(&lock);
        ```

    - **Khi nào dùng?** Tác vụ rất ngắn, tránh overhead của context switch.
- **Read Lock vs Write Lock:**
    - Là khóa phân biệt đọc (read) và ghi (write), dùng trong `RWMutex`.
    - **Cách hoạt động:**
        - **Read Lock:** Nhiều thread có thể đọc cùng lúc (không xung đột).
        - **Write Lock:** Chỉ 1 thread ghi, chặn cả đọc và ghi khác.
    - **Ví dụ trong Go:**

        ```go
        var rwMutex sync.RWMutex
        var data int
        
        func read() {
        	rwMutex.RLock()
        	fmt.Println(data)
        	rwMutex.RUnlock()
        }
        
        func write() {
        	rwMutex.Lock()
        	data++
        	rwMutex.Unlock()
        }
        ```


### **What is Deadlock and How to Avoid Deadlock?**

- **Deadlock là gì?** Là tình trạng nhiều thread/process bị kẹt mãi mãi, mỗi cái đợi tài nguyên mà cái khác đang giữ.
- **Điều kiện xảy ra (Coffman conditions):**
    1. **Mutual Exclusion:** Tài nguyên chỉ 1 thread giữ.
    2. **Hold and Wait:** Thread giữ tài nguyên và đợi tài nguyên khác.
    3. **No Preemption:** Không thể cướp tài nguyên.
    4. **Circular Wait:** Chuỗi thread đợi vòng tròn.
- **Ví dụ:**
    - Thread 1: Giữ Lock A, đợi Lock B.
    - Thread 2: Giữ Lock B, đợi Lock A → Deadlock.
- **Cách tránh:**
    1. **Resource Ordering:** Luôn khóa theo thứ tự cố định (ví dụ: Lock A trước B).
    2. **Timeout:** Thử khóa trong thời gian giới hạn, bỏ nếu không được.
    3. **Avoid Nested Locks:** Giảm số khóa cần giữ cùng lúc.
    4. **Use Higher-Level Abstractions:** Dùng channel (Go) thay vì lock thủ công.
- **Ví dụ tránh deadlock trong Go:**

    ```go
    var mutexA, mutexB sync.Mutex
    
    func process1() {
    	mutexA.Lock() // Luôn khóa A trước
    	mutexB.Lock()
    	// Critical zone
    	mutexB.Unlock()
    	mutexA.Unlock()
    }
    
    func process2() {
    	mutexA.Lock() // Cùng thứ tự
    	mutexB.Lock()
    	// Critical zone
    	mutexB.Unlock()
    	mutexA.Unlock()
    }
    ```


## How does memory is managed in the OS?

- **Quản lý bộ nhớ trong OS:**
    - OS chịu trách nhiệm cấp phát, theo dõi, và thu hồi bộ nhớ (RAM) cho các process.
    - **Mục tiêu:** Tối ưu hóa sử dụng RAM, cô lập process, bảo vệ dữ liệu.
- **Cách hoạt động:**
    1. **Phân vùng (Partitioning):** Chia RAM thành các vùng cho từng process (cũ, ít dùng).
    2. **Paging:** Chia RAM và bộ nhớ process thành các page cố định (thường 4KB), ánh xạ qua bảng page (xem phần Paging).
    3. **Segmentation:** Chia theo logic (code, data, stack), ít phổ biến hơn paging.
    4. **Virtual Memory:** Tạo không gian địa chỉ ảo, ánh xạ đến RAM hoặc đĩa (xem phần Virtual Memory).
- **Công cụ:**
    - **Memory Management Unit (MMU):** Phần cứng trong CPU ánh xạ địa chỉ ảo sang vật lý.
    - **Kernel:** Quản lý bảng page, cấp phát/thu hồi.

---

### What is virtual memory? Why do we need it? How does it work?

![image.png](https://github.com/user-attachments/assets/2e296f6b-10ce-46d9-800d-2939c0363e65)

- **Virtual Memory là gì?** Là lớp trừu tượng cung cấp cho mỗi process một không gian địa chỉ ảo riêng, tách biệt khỏi RAM vật lý.
- **Tại sao cần?**
    1. **Cô lập:** Mỗi process nghĩ nó có bộ nhớ riêng, không truy cập nhầm process khác.
    2. **Tối ưu:** Dùng đĩa (swap) khi RAM đầy → chạy được nhiều process hơn dung lượng RAM.
    3. **Bảo vệ:** Ngăn process truy cập địa chỉ không được phép (memory protection).
- **Cách hoạt động:**
    1. Mỗi process có bảng **page (page table)** lưu ánh xạ từ địa chỉ ảo sang địa chỉ vật lý.
    2. MMU dịch địa chỉ ảo (virtual address) sang địa chỉ vật lý (physical address) khi truy cập.
    3. Nếu page không có trong RAM (page fault), OS nạp từ đĩa (swap space) hoặc cấp page mới.
- **Ví dụ:** Process A thấy địa chỉ `0x1000`, Process B cũng thấy `0x1000`, nhưng chúng ánh xạ đến RAM khác nhau.

**How large virtual memory is?**

- **Kích thước:**
    - Phụ thuộc kiến trúc CPU:
        - **32-bit:** 4GB (2^32 bytes) cho mỗi process.
        - **64-bit:** 16 exabytes (2^64 bytes) lý thuyết, nhưng thực tế OS giới hạn (ví dụ: Linux dùng 128TB cho user space).
    - Một phần dành cho kernel, phần còn lại cho user space.
- **Thực tế:** Không phải toàn bộ đều ánh xạ đến RAM, chỉ một phần nhỏ được dùng (sparse memory).

**What is paging?**

- **Paging là gì?**
    - Là kỹ thuật chia bộ nhớ (ảo và vật lý) thành các **page** cố định (thường 4KB).
    - Mỗi process có bảng page ánh xạ page ảo sang page vật lý.
- **Cách hoạt động:**
    1. Địa chỉ ảo chia thành **page number** (số page) và **offset** (vị trí trong page).
    2. MMU tra bảng page để tìm page vật lý, cộng offset để lấy địa chỉ thật.
    3. Nếu page không có (page fault), OS nạp từ đĩa hoặc cấp phát.
- **Ví dụ:** Địa chỉ ảo `0x1234` (page size 4KB):
    - Page number: `0x1` (4096-8191).
    - Offset: `0x234`.
    - Ánh xạ sang RAM: `0x5000 + 0x234 = 0x5234`.

**Can 2 processes map to the same physical address? How and in which case?**

- **Câu trả lời:** Có, trong một số trường hợp đặc biệt.
- **Trường hợp:**
    1. **Shared Memory:** Hai process dùng IPC (như `shm_open`) để chia sẻ vùng nhớ → cùng ánh xạ đến một page vật lý.
    2. **Shared Libraries:** Thư viện như `libc.so` được ánh xạ read-only vào RAM, nhiều process dùng cùng page vật lý.
    3. **Copy on Write (COW):** Sau `fork()`, child và parent tạm thời chia sẻ page vật lý, chỉ sao chép khi ghi.
- **Cách thực hiện:** Kernel thiết lập bảng page để hai địa chỉ ảo trỏ đến cùng địa chỉ vật lý.

### What is heap space and stack space?

- **Heap Space:**
    - **Hình dung:** Hãy nghĩ heap như một **kho hàng lớn** trong nhà mày. Muốn lấy đồ trong kho, bạn phải tự đi tìm chỗ trống, tự xếp đồ vào (cấp phát), và tự dọn dẹp khi không cần nữa (giải phóng).
    - **Đặc điểm:**
        - Mày quyết định kích thước và thời gian giữ đồ (qua `malloc` hoặc `new`).
        - Nếu không dọn (không free), kho sẽ đầy rác → hết chỗ.
    - **Ví dụ đời thực**: Bạn mua một thùng đồ chơi lớn, để trong kho (heap). Khi chơi xong, bạn phải tự vứt đi, không thì nó chiếm chỗ mãi.
- **Stack Space:**
    - **Hình dung:** Stack giống như một **chồng đĩa** trong bếp. Bạn chỉ có thể đặt đĩa lên trên cùng (`push`) và lấy từ trên cùng (`pop`). Khi mày dùng xong, đĩa tự động được dọn (khi hàm kết thúc).
    - **Đặc điểm:**
        - Máy tính tự quản lý, bạn không cần lo dọn dẹp.
        - Chồng đĩa có giới hạn chiều cao → nếu xếp quá nhiều, nó sẽ đổ (**stack overflow**).
    - **Ví dụ đời thực**: Bạn đặt đĩa ăn lên chồng đĩa. Khi ăn xong, lấy đĩa ra, chồng đĩa tự giảm.

### **What will happen with memory when you open an application?**

- **Hình dung đơn giản**: Khi bạn mở một ứng dụng, OS giống như một quản lý tòa nhà, nó phải tìm chỗ trống trong RAM (nhà kho vật lý), cấp không gian cho ứng dụng hoạt động, và chuẩn bị mọi thứ để ứng dụng chạy được.
- **Từng bước xảy ra**:
    1. **Tạo Process (Quản lý cấp căn hộ):**
        - OS nhận lệnh mở ứng dụng (ví dụ: bạn click icon Chrome).
        - Nó tạo một **process** mới – như cấp một căn hộ riêng trong tòa nhà RAM cho Chrome.
        - Mỗi process có **PID** (Process ID) riêng để OS theo dõi.
    2. **Cấp không gian địa chỉ ảo (Virtual Memory):**
        - OS không đưa thẳng RAM cho process mà tạo một **không gian địa chỉ ảo** (như bản đồ giả trong căn hộ).
        - Với 64-bit OS, không gian này siêu lớn (hàng terabyte), nhưng chỉ một phần nhỏ được dùng thực sự.
        - Ví dụ: Chrome nghĩ nó có cả tòa nhà riêng, nhưng thực tế chỉ dùng vài phòng.
    3. **Nạp file thực thi vào RAM (Đưa đồ đạc vào nhà):**
        - OS đọc file thực thi (`chrome.exe` trên Windows, `chrome` trên Linux) từ ổ cứng.
        - File này được chia thành các phần:
            - **Code Segment:** Mã lệnh của Chrome (như bản thiết kế nhà).
            - **Data Segment:** Biến toàn cục khởi tạo (như đồ nội thất cố định).
        - Các phần này được nạp vào RAM và ánh xạ vào không gian ảo qua **page table**.
    4. **Liên kết thư viện động (Mượn đồ dùng chung):**
        - Chrome cần thư viện như `libc` (để in chữ, kết nối mạng).
        - OS dùng **dynamic linker** (như `ld.so` trên Linux) để nạp libc vào RAM.
        - Nếu `libc` đã có trong RAM (do ứng dụng khác dùng), Chrome chỉ mượn chung → tiết kiệm chỗ.
    5. **Cấp phát Stack (Chuẩn bị bàn làm việc):**
        - OS tạo một **stack** cho thread chính (main thread) của Chrome.
        - Stack giống như một chồng giấy trên bàn làm việc: lưu biến cục bộ, tham số, và nơi quay lại.
        - Kích thước ban đầu nhỏ (vài KB), nhưng có thể tăng đến giới hạn (thường 1-8MB).
    6. **Cấp phát Heap (Kho chứa đồ linh hoạt):**
        - OS dành sẵn một vùng **heap** cho Chrome, nhưng chưa dùng ngay.
        - Heap là kho trống, Chrome sẽ tự lấy chỗ trong kho này khi cần (qua `malloc` hoặc `new`), ví dụ: để lưu danh sách tab.
    7. **Bắt đầu chạy (Nhân viên vào làm việc):**
        - OS đặt **Program Counter (PC)** vào lệnh đầu tiên trong `main()` của Chrome.
        - CPU bắt đầu chạy mã lệnh từ Code Segment, dùng stack và heap khi cần.

---

**Ví dụ cụ thể - khi bạn click vào icon Chrome**

1. OS tạo process (**PID: 1234**).
2. Cấp không gian ảo (ví dụ: 128TB, nhưng chỉ dùng vài MB ban đầu).
3. Nạp chrome từ ổ cứng:
    - Code: Hàm hiển thị giao diện.
    - Data: Biến như `version = "120.0"`.
4. Liên kết `libc.so` (đã có trong RAM từ process khác).
5. Tạo stack cho `main()` (lưu biến cục bộ).
6. Chuẩn bị heap (trống, chờ Chrome mở tab).
7. Chạy `main()`, Chrome hiện lên màn hình.

**Trạng thái bộ nhớ sau khi mở:**

- **RAM (Physical Memory):** Chứa Code Segment, Data Segment, một phần stack và heap (nếu dùng).
- **Virtual Memory:** Bản đồ ảo ánh xạ các phần trên vào RAM hoặc đĩa (swap nếu RAM đầy).
- **Stack:** Chứa frame của `main()` (biến cục bộ, địa chỉ trả về).
- **Heap:** Trống hoặc chứa dữ liệu động (như tab nếu mở ngay).

**Hình dung đơn giản:**

- RAM như một cái nhà kho thật:
    - Code/Data: Đồ đạc cố định (ghế, bàn).
    - Stack: Chồng giấy trên bàn (dùng tạm, tự dọn).
    - Heap: Kho trống (mày tự lấy đồ, tự dọn).
- Virtual Memory như bản đồ giả:
    - Chrome thấy cả thế giới, nhưng chỉ dùng vài góc nhỏ trong nhà kho.

**Điều gì xảy ra tiếp theo?**

- Khi Chrome mở tab:
    - Heap tăng (cấp phát bộ nhớ cho tab).
    - Stack tăng nếu gọi hàm mới (như xử lý HTML).
- Khi đóng Chrome:
    - OS thu hồi stack, heap, giải phóng RAM, xóa ánh xạ ảo.

### What will happen when you call another function (with parameters) or return from a function?

#### **Ví dụ code:**

```c
#include <stdio.h>
void add(int a, int b) {
    int sum = a + b; // Biến cục bộ
    printf("Sum: %d\n", sum);
}
int main() {
    int x = 5;
    add(x, 3); // Gọi hàm
    return 0;
}
```

**Hình dung stack như chồng đĩa**: Stack là một chồng đĩa, mỗi lần gọi hàm là đặt một đĩa mới lên trên. Khi hàm xong, đĩa đó được lấy ra.

**Bước 1: Trước khi gọi hàm add**

- **Trạng thái ban đầu:**
    - Trong `main()`, biến `x = 5` được đặt lên stack (như một đĩa nhỏ ghi "`x = 5`").
    - Stack hiện tại:

        ```c
        | Đĩa của main: x = 5 | <- Đỉnh stack (SP)
        ```


**Bước 2: Gọi hàm `add(x, 3)`**

- **Chuyện gì xảy ra:**
    1. **Đặt thông tin lên stack:**
        - Máy tính đặt **địa chỉ quay lại** (nơi tiếp tục trong main) lên stack.
        - Đặt **tham số** `a = 5` (lấy từ `x`) và `b = 3` lên stack.
    2. **Tạo đĩa mới cho add:**
        - Máy tính đặt một đĩa mới lên stack cho hàm `add`, thêm biến cục bộ `sum`.
- **Stack sau khi gọi add:**

    ```c
    | Đĩa của main: x = 5         |
    | Địa chỉ quay lại (main)     |
    | Tham số a = 5               |
    | Tham số b = 3               |
    | Biến cục bộ sum = 8         | <- Đỉnh stack (SP)
    ```

- **Heap:** Không thay đổi, vì không có cấp phát động ở đây.
- **Hình dung** giống như bạn đặt thêm một chồng đĩa mới lên bàn khi làm việc khác (tính tổng). Đĩa mới chứa `a`, `b`, và `sum`.

**Bước 3: Thực thi trong hàm `add`**

- Máy tính tính `sum = a + b = 8`, lưu vào đĩa của `add`.
- In ra: `Sum: 8`.

**Bước 4: Thoát khỏi hàm `add` (return)**

- **Chuyện gì xảy ra:**
    1. **Lấy đĩa ra:**
        - Máy tính lấy đĩa của `add` ra khỏi stack (xóa `sum`, `a`, `b`).
        - Đỉnh stack (SP) giảm xuống, quay lại địa chỉ trả về.
    2. **Quay lại `main`:**
        - Máy tính đọc địa chỉ quay lại, tiếp tục chạy `main`.
- **Stack sau khi thoát:**

    ```c
    | Đĩa của main: x = 5 | <- Đỉnh stack (SP)
    ```

- **Heap:** Vẫn không thay đổi.
- **Hình dung** bạn dùng xong đĩa của `add`, lấy nó ra khỏi chồng đĩa, quay lại chồng đĩa của `main`.

#### **Ví dụ mở rộng (có heap):**

```c
#include <stdio.h>
#include <stdlib.h>
int* createArray() {
    int *arr = malloc(3 * sizeof(int)); // Heap
    arr[0] = 1;
    return arr; // Trả về con trỏ
}
int main() {
    int x = 5; // Stack
    int *arr = createArray(); // Gọi hàm
    printf("Arr[0]: %d\n", arr[0]);
    free(arr); // Dọn heap
    return 0;
}
```

- **Stack:** `x` và địa chỉ trả về nằm trên stack.
- **Heap:** `arr` được cấp phát trên heap, tồn tại sau khi `createArray` kết thúc.

### What causes stack-over-flow?

- **Nguyên nhân** do ****Stack vượt quá kích thước giới hạn (thường 1-8MB):
    1. **Đệ quy vô hạn:** Hàm gọi chính nó không dừng.
    2. **Stack frame lớn:** Quá nhiều biến cục bộ hoặc gọi hàm lồng nhau sâu.
- **Ví dụ:**

    ```c
    void recurse() { recurse(); } // Stack overflow
    ```


### **What is dynamic allocating? How does it work?**

- **Hiểu đơn giản:**
    - **Dynamic Allocating** là cách bạn xin thêm bộ nhớ trong **heap** (kho chứa đồ lớn) khi chương trình đang chạy, thay vì cố định sẵn từ đầu như biến cục bộ trên stack.
    - Nó giống như bạn đi siêu thị mua đồ: bạn không biết trước cần bao nhiêu, nên lúc nào cần thì mới lấy thêm, và bạn phải tự trả lại khi không dùng nữa.
    - Khi nào cần?
        - Khi bạn không biết trước kích thước dữ liệu (ví dụ: mảng lớn tùy người dùng nhập).
        - Khi dữ liệu cần tồn tại lâu hơn một hàm (không bị xóa tự động như stack).
- **How does it work?**
    1. Yêu cầu bộ nhớ (Cấp phát):
        - Chương trình nói với OS: "Cho tao một ít bộ nhớ trong heap đi!”
        - Dùng hàm như `malloc` (C), `new` (C++), hoặc tương tự trong các ngôn ngữ khác.
    2. OS và thư viện xử lý:
        - OS (thông qua thư viện như `libc`) tìm một vùng trống trong heap đủ lớn.
        - Nếu heap hết chỗ, OS xin thêm RAM (qua `sbrk` hoặc `mmap` trên Linux).
        - Sau đó, nó trả lại bạn một **con trỏ** (`pointer`) – như địa chỉ của "khoảng trống" trong heap.
    3. Dùng bộ nhớ:
        - Bạn dùng con trỏ để ghi/đọc dữ liệu trong vùng nhớ đó.
    4. Giải phóng (nếu cần):
        - Khi không dùng nữa, bạn gọi `free` (C) hoặc `delete` (C++) để trả lại chỗ trống cho heap.
- **So sánh rõ hơn:**


    | **Tiêu chí** | **Stack** | **Heap** |
    | --- | --- | --- |
    | **Kích thước biết khi nào?** | Trước chạy (compile time) | Khi chạy (runtime) |
    | **Ví dụ khai báo** | int arr[10] (cố định) | malloc(size * 4) (linh hoạt) |
    | **Thay đổi kích thước** | Không được | Được (qua realloc) |
    | **Quản lý** | Tự động (OS) | Thủ công (mày tự xin/trả) |
    - **Stack:** Giống như mày đặt sẵn 10 cái cốc trên bàn từ đầu, không thêm được khi khách đông.
    - **Heap:** Giống như mày chạy ra kho lấy số cốc tùy ý (5, 10, 100), dựa trên số khách lúc đó.
- Ví dụ trong Golang:

    ```go
    package main
    
    import "fmt"
    
    func stackExample() {
        var fixed [3]int = [3]int{1, 2, 3} // Stack, cố định
        fmt.Println("Stack array:", fixed)
    }
    
    func heapExample(size int) {
        dynamic := make([]int, size) // Heap, động
        for i := 0; i < size; i++ {
            dynamic[i] = i + 1
        }
        fmt.Println("Heap slice:", dynamic)
    }
    
    func main() {
        stackExample() // Gọi hàm dùng stack
    
        var size int
        fmt.Print("Nhap kich thuoc: ")
        fmt.Scan(&size)
        heapExample(size) // Gọi hàm dùng heap
    }
    ```


### How does deallocation work?

- **Hiểu đơn giản:**
    - **Deallocation** là việc bạn "trả lại" bộ nhớ đã mượn từ **heap** (kho chứa đồ lớn) để nó có thể được dùng lại cho việc khác.
    - Tùy ngôn ngữ:
        - Trong **C** bạn phải tự tay trả (thủ công).
        - Trong **Go** máy tính tự dọn (tự động).
- Trong ngôn ngữ C:
    - Khi bạn xin bộ nhớ trên heap bằng `malloc()` (như mượn một thùng đồ trong kho), bạn dùng xong thì gọi `free()` để trả lại.
    - Ví dụ:

        ```c
        #include <stdio.h>
        #include <stdlib.h>
        
        int main() {
            int *arr = malloc(5 * sizeof(int)); // Mượn 20 bytes
            arr[0] = 10; // Dùng nó
            printf("Gia tri: %d\n", arr[0]);
            free(arr); // Trả lại
            return 0;
        }
        ```

- Trong ngôn ngữ Golang:
    - Go không có `free()`. Thay vào đó, **Garbage Collector (GC)** – như một người dọn kho tự động – sẽ tìm và dọn bộ nhớ không còn dùng.
    - Ví dụ:

        ```go
        package main
        
        import "fmt"
        
        func main() {
            arr := make([]int, 5) // Tạo slice 5 phần tử trên heap
            arr[0] = 10
            fmt.Println(arr[0]) // Dùng nó
            arr = nil // Không còn tham chiếu
            // GC sẽ tự dọn sau
        }
        ```


### What happens when your computer is full of memory?

- **Hiểu đơn giản** là khi **RAM** (nhà kho thật) đầy, máy tính không dừng ngay mà cố gắng "mở rộng" bằng cách dùng ổ cứng (swap). Nhưng nếu cả RAM và swap đầy, máy sẽ gặp rắc rối lớn.
- **Khi RAM đầy:**
    - **Ví dụ** bạn mở 20 tab Chrome, RAM 8GB đầy. OS chuyển dữ liệu của tab cũ sang swap, Chrome vẫn chạy nhưng chậm hơn (vì đọc từ ổ cứng chậm hơn RAM).
    - Đối với từng hệ điều hành:
        - **Windows:** Chậm dần, có thể hiện thông báo "Low memory".
        - **Linux:** Dùng swap, nếu cấu hình tốt thì vẫn mượt.
- **Khi cả RAM và Swap đầy:**
    - Chuyện gì xảy ra?
        1. **Chậm hoặc treo:** Máy tính cố chạy nhưng không đủ chỗ xử lý.
        2. Kill chương trình
            - **Linux:** Dùng **OOM Killer** để chọn và tắt chương trình dùng nhiều RAM nhất (như Chrome).
            - **Windows:** Hiện cảnh báo "Close programs to free memory", nếu không đóng, máy có thể freeze.
        3. **Crash:** Nếu quá tải, hệ thống có thể ngừng hoạt động (kernel panic trên Linux, blue screen trên Windows).
    - **Ví dụ** bạn mở 50 tab Chrome, chơi game, và chạy IDE cùng lúc trên máy 8GB RAM + 4GB swap. Swap đầy, Linux giết Chrome, hoặc Windows treo máy.

### Why you do not need to "deallocate" local variable?

- **Biến cục bộ (local variable):** Là biến mày khai báo trong một hàm, như `int x` trong `main()`. Nó sống trên **stack** (chồng đĩa nhỏ), không phải trên **heap** (kho lớn).
- **Lý do chính:** Stack được hệ điều hành tự động quản lý. Khi hàm kết thúc, stack tự "dọn dẹp" biến cục bộ, nên bạn không cần làm gì cả.
- Chi tiết hơn:
    - Cách stack hoạt động:
        - Stack dùng một con trỏ gọi là **Stack Pointer (SP)** – như ngón tay chỉ vào đỉnh chồng đĩa.
        - Khi bạn gọi hàm - SP giảm xuống, thêm đĩa mới (stack frame) chứa biến cục bộ.
        - Khi hàm kết thúc - SP tăng lên, đĩa bị lấy ra, bộ nhớ tự động "giải phóng" (thực tế là không còn truy cập được).
    - Không cần deallocate vì stack tự động tăng/giảm SP, biến cục bộ bị xóa ngay khi hàm thoát, không cần bạn can thiệp.

### How does Garbage Collection work?

- **Garbage Collection (GC)** là một người dọn kho tự động trong máy tính. Nó tìm và dọn những "thùng đồ" (bộ nhớ) trên **heap** mà bạn không còn dùng nữa, để kho có chỗ trống cho việc khác.
- Trong các ngôn ngữ như **Go**, **Java**, hay **Python**, GC thay mày làm việc "giải phóng bộ nhớ" (như free trong C), nên bạn không cần tự tay dọn.
- Cách GC hoạt động sẽ có 02 bước chính:
    1. **Mark (Đánh dấu):**
        - GC đi kiểm tra xem "thùng đồ" nào còn được dùng.
        - Nó bắt đầu từ các **root** (như biến toàn cục, biến cục bộ đang sống trên stack) và theo các **con trỏ** (pointer) để tìm tất cả thùng đồ còn có người "chỉ tay tới" (reachable).
        - Thùng nào không ai chỉ tới nữa (unreachable) bị đánh dấu là rác.
    2. **Sweep (Dọn dẹp):**
        - GC quét qua kho (heap), thấy thùng nào bị đánh dấu rác thì dọn đi, trả lại chỗ trống cho heap.
        - Bộ nhớ trống này có thể được dùng lại khi mày tạo dữ liệu mới.
- When will it be triggered?
    1. **Khi Heap áp lực (Heap Pressure):**
        - Heap đầy hoặc gần đầy (nhiều thùng đồ mới được tạo).
        - Trong Go, GC chạy khi lượng bộ nhớ mới vượt ngưỡng (threshold), dựa trên tỷ lệ được gọi là **`GOGC`** (mặc định là 100).
        - **`GOGC = 100` nghĩa là:** Khi heap tăng gấp đôi kích thước sau lần GC trước, GC sẽ chạy lại.
    2. **Theo định kỳ**: Go có thể chạy GC định kỳ (ví dụ: mỗi vài phút), ngay cả khi heap chưa đầy, để giữ hệ thống sạch sẽ.
    3. **Gọi thủ công (hiếm dùng)**: Trong Go, mày có thể ép GC chạy bằng `runtime.GC()`, nhưng ít ai làm vì GC tự động đủ tốt.

### What is a pointer? What difference between `pass by value` and `pass by reference`?

- **Pass by value (Truyền giá trị):** Bạn đưa tôi một **bản sao** của hộp quà. Tôi thay đổi bản sao, hộp gốc của bạn không đổi.

  Ví dụ Golang:

    ```go
    package main
    
    import "fmt"
    
    func change(a int) {
        a = 20
    }
    
    func main() {
        x := 10
        change(x)
        fmt.Println("x sau khi goi ham:", x) // Vẫn là 10
    }
    ```

- **Pass by reference (Truyền tham chiếu):** Bạn đưa tôi **địa chỉ** của hộp quà (con trỏ). Tôi thay đổi hộp thật, hộp gốc của bạn cũng đổi.

  Ví dụ Golang:

    ```go
    #include <stdio.h>
    
    void change(int *a) {
        *a = 20; // Thay đổi giá trị tại địa chỉ
    }
    
    int main() {
        int x = 10;
        change(&x); // Truyền địa chỉ của x
        printf("x sau khi goi ham: %d\n", x); // 20
        return 0;
    }
    ```


### Where global variable will be saved?

Biến toàn cục (global variables) được lưu trong một vùng cụ thể của không gian địa chỉ ảo của process, gọi là **Data Segment**. Dưới đây là chi tiết:

- **Data Segment là gì?**
    - **Data Segment** (hoặc Data Section) là vùng bộ nhớ trong address space của process, dùng để lưu trữ:
        - **Biến toàn cục (global variables):** Khai báo ngoài hàm, tồn tại suốt vòng đời process.**Biến toàn cục (global variables):** Khai báo ngoài hàm, tồn tại suốt vòng đời process.
        - **Biến tĩnh (static variables):** Khai báo với từ khóa `static`, cũng tồn tại suốt vòng đời process.
    - Nó được chia thành hai phần:
        1. Initialized Data Segment:
        - Lưu biến toàn cục/static đã khởi tạo giá trị.
        - Ví dụ: `int globalVar = 10;`
        1. Uninitialized Data Segment (BSS - Block Started by Symbol):
        - Lưu biến toàn cục/static không khởi tạo (mặc định = 0).
        - Ví dụ: `int globalVar;` (sẽ tự động = 0).
- **Vị trí trong Virtual Memory**
    - Khi process được nạp (loaded) từ file thực thi (như `a.out`):
        - **Code Segment:** Chứa mã lệnh (text section).
        - **Data Segment:** Chứa biến toàn cục/static (initialized + BSS).
        - **Stack:** Biến cục bộ, call stack.
        - **Heap:** Bộ nhớ động.
    - Data Segment nằm ở một vùng cố định trong virtual address space, ánh xạ đến RAM qua page table.
- **Ví dụ minh họa**

    ```c
    int globalVar1 = 42;  // Initialized global variable
    int globalVar2;       // Uninitialized global variable
    static int staticVar = 100;  // Static variable
    
    int main() {
        int localVar = 5;  // Local variable (stack)
        return 0;
    }
    ```

    - Nơi lưu:
        - `globalVar1` và `staticVar`: Trong **Initialized Data Segment**.
        - `globalVar2`: Trong **BSS** (giá trị mặc định = 0).
        - `localVar`: Trong **Stack**.
- **Cách OS quản lý Data Segment**
    - Nạp từ file thực thi:
        - Khi process khởi động, linker (như `ld`) tổ chức file thực thi (ELF trên Linux) với các section: `.text` (code), `.data` (initialized), `.bss` (uninitialized).
        - Kernel nạp `.data` và `.bss` vào RAM, ánh xạ vào virtual address space.
    - Read-Write:
        - Data Segment là **read-write** (khác với Code Segment là read-only), process có thể thay đổi giá trị biến toàn cục/static.

## Why in Linux `everything is "file"`?

- Trong Linux (và Unix), triết lý "everything is a file" có nghĩa là hầu hết tài nguyên (file, thiết bị, socket, pipe, v.v.) đều được biểu diễn và tương tác như một **file** trong hệ thống file.
- **Tại sao?**
    - **Đơn giản hóa:** Thay vì mỗi loại tài nguyên có API riêng, OS dùng giao diện thống nhất (open, read, write, close) để xử lý tất cả.
    - **Tính trừu tượng:** Che giấu sự phức tạp của phần cứng hoặc tài nguyên, giúp lập trình viên dễ làm việc.
- **Ví dụ:**
    - File thông thường: `/home/user.txt` → đọc/ghi bằng `read()`, `write()`.
    - Thiết bị: `/dev/sda` (ổ cứng) → truy cập như file.
    - Socket: `/tmp/mysocket.sock` → giao tiếp qua `read()`, `write()`.
    - Pipe: `pipefd[0]` → truyền dữ liệu giữa process.
- **Cơ chế**: Kernel ánh xạ các tài nguyên này qua **inode** (cấu trúc dữ liệu mô tả file) và **file descriptor**.
- **Lợi ích:** Code tái sử dụng, quản lý tài nguyên dễ dàng, mở rộng hệ thống linh hoạt.

### How does mouse/keyboard/monitor communicate with your computer?

Các thiết bị ngoại vi (mouse, keyboard, monitor) giao tiếp với máy tính qua **driver** (trình điều khiển) và **interrupt** (ngắt) do kernel xử lý.

- Mouse/Keyboard:
    - Cách hoạt động:
        1. **Phần cứng:** Khi nhấn phím hoặc di chuột, thiết bị gửi tín hiệu điện qua USB/PS2.
        2. **Interrupt:** Bộ điều khiển (controller) trong CPU nhận tín hiệu, gây ngắt phần cứng (hardware interrupt).
        3. **Driver:** Kernel gọi driver tương ứng (như `usbhid` cho USB) để dịch tín hiệu thành dữ liệu (keycode, tọa độ).
        4. **Truyền đến process:** Dữ liệu được gửi qua hệ thống file ảo (như `/dev/input/event0`) hoặc X server (giao diện đồ họa).
    - **Ví dụ:** Nhấn phím "A" → driver chuyển thành keycode 65 → process đọc từ `/dev/input`.
- Monitor
    - Cách hoạt động:
        1. **Phần mềm:** Process (như Xorg, Wayland) gửi dữ liệu đồ họa (pixel) qua driver video (như `nvidia.ko`).
        2. **Driver:** Chuyển dữ liệu sang GPU (card đồ họa).
        3. **GPU:** Vẽ lên framebuffer (bộ nhớ đồ họa), gửi tín hiệu qua HDMI/DisplayPort đến monitor.
    - **Lưu ý:** Monitor không "gửi" dữ liệu về, chỉ nhận từ máy tính.
    - **Ví dụ:** Chrome vẽ tab → driver gửi pixel qua GPU → hiển thị trên màn hình.
- Linux
    - Các thiết bị được biểu diễn dưới dạng file trong `/dev` (như `/dev/input/mouse0`, `/dev/fb0`), phù hợp triết lý "everything is a file".

### What is file descriptor?

- **File descriptor (FD)** là một số nguyên không âm mà kernel dùng để đại diện cho một tài nguyên I/O (file, socket, pipe, thiết bị) mà process đang truy cập.
- Vai trò là "tay cầm" (handle) để process thao tác với tài nguyên qua các hàm như `open()`, `read()`, `write()`, `close()`.
- Cách hoạt động:
    - Khi process mở tài nguyên (như `fd = open("file.txt", O_RDONLY))`, kernel trả về FD (ví dụ: 3).
    - FD ánh xạ đến một entry trong **file descriptor table** của process, trỏ đến cấu trúc kernel (như `struct file`) chứa thông tin tài nguyên.
- Ví dụ:
    - FD mặc định: `0` (STDIN), `1` (STDOUT), `2` (STDERR).
    - Mở file: `fd = 3` → đọc bằng `read(3, buffer, 10)`.
- **Linux:** FD là cách process tương tác với "file" (bao gồm cả thiết bị, socket).

### What is buffer? Why do we need buffer?

- **Buffer** là vùng bộ nhớ tạm để lưu dữ liệu khi truyền giữa các thành phần (như file → process, process → mạng).
- Tại sao cần?
    - **Tăng hiệu suất**: Đọc/ghi từng byte chậm (do system call hoặc độ trễ phần cứng). Buffer gom dữ liệu thành khối lớn, giảm số lần truy cập.
    - **Điều hòa tốc độ**: Nguồn và đích có tốc độ khác nhau (như mạng nhanh, process chậm) → buffer giữ dữ liệu tạm.
    - **Giảm tải**: Tránh gọi kernel hoặc phần cứng quá nhiều.
    - **Liên tục**: Đảm bảo dữ liệu sẵn sàng (như streaming video).
- Ví dụ:
    - Đọc file: `read(fd, buffer, 4096)` → đọc 4KB vào buffer thay vì từng byte.
    - Socket: Dữ liệu từ mạng vào receive buffer → process đọc khi sẵn sàng.

### What will happen if 2 processes read/write to the same file?

Tùy vào ngữ cảnh thì 2 process đọc/ghi cùng file có thể gây xung đột nếu không đồng bộ. Kết quả phụ thuộc vào cách mở file và cơ chế khóa.

- **Read-only (Chỉ đọc):**
    - **Hiện tượng:** Cả 2 process đọc cùng file không vấn đề gì.
    - **Lý do:** Đọc không thay đổi dữ liệu, kernel cho phép nhiều process truy cập đồng thời.
    - **Ví dụ:** Process A và B cùng đọc `/etc/passwd` → cả hai thấy nội dung giống nhau.
- **Write-only/Read-Write (Ghi hoặc đọc-ghi):**
    - **Không đồng bộ:**
        - **Kết quả:** Dữ liệu có thể bị hỏng (data corruption) vì process ghi đè lên nhau.
        - **Ví dụ:**
            - Process A ghi "Hello" vào offset 0.
            - Process B ghi "World" cùng offset 0 → file cuối cùng chỉ chứa "World" (hoặc hỗn loạn nếu ghi đồng thời).
    - **Cơ chế kernel:**
        - Kernel không tự đồng bộ, chỉ ghi theo thứ tự nhận lệnh từ process.
        - Offset của file descriptor độc lập cho mỗi process (trừ khi dùng `O_APPEND`).
- **Đồng bộ hóa:**
    - **File Locking:**
        - Dùng flock() hoặc fcntl() để khóa file:
            - **Advisory lock:** Process khác có thể bỏ qua nếu không kiểm tra.
            - **Mandatory lock:** Kernel chặn truy cập.
        - Ví dụ:

            ```c
            int fd = open("file.txt", O_RDWR);
            flock(fd, LOCK_EX);  // Khóa độc quyền
            write(fd, "Hello", 5);
            flock(fd, LOCK_UN);  // Mở khóa
            ```

    - **Kết quả:** Process B đợi Process A ghi xong mới ghi → tránh xung đột.
- **Append Mode (`O_APPEND`):**
    - Nếu mở file với `O_APPEND`:
        - Mọi ghi được thêm vào cuối file, không ghi đè.
        - Ví dụ: Process A ghi "Hello", Process B ghi "World" → file thành "HelloWorld".
- **Atomic Operations:**
    - Một số thao tác (như `write()` dưới 4KB) là nguyên tử (atomic) trên Linux → giảm nguy cơ hỏng dữ liệu, nhưng không đảm bảo hoàn toàn nếu không khóa.
    - **Tóm lại:**
        - Đọc cùng lúc: OK.
        - Ghi cùng lúc: Có thể hỏng dữ liệu, cần khóa (lock) hoặc `O_APPEND` để an toàn.

## **What is system call (`syscall`)?**

- **System call** (gọi hệ thống) là cách mà một chương trình ở **user space** (không gian người dùng) yêu cầu dịch vụ từ **kernel** (nhân hệ điều hành) để thực hiện các tác vụ mà nó không thể tự làm trực tiếp, như truy cập phần cứng, quản lý file, hoặc tạo process.
- Vai trò là "cầu nối" giữa ứng dụng và OS, cho phép thực hiện các thao tác cấp thấp (low-level) một cách an toàn và kiểm soát.
- **Ví dụ:**
    - `open()`: Mở file → syscall `sys_open`.
    - `read()`: Đọc file → syscall `sys_read`.
    - `fork()`: Tạo process → syscall `sys_fork`.

### **How to do a syscall?**

- Trong lập trình, mày không gọi `syscall` trực tiếp mà dùng các hàm thư viện (library functions) như `libc`, sau đó chúng gọi `syscall` tương ứng. Tuy nhiên, bạn cũng có thể gọi `syscall` trực tiếp nếu muốn.
- **Dùng thư viện (phổ biến nhất):**
    - **Ví dụ (C):**

        ```c
        #include <unistd.h>
        #include <fcntl.h>
        int main() {
            int fd = open("file.txt", O_RDONLY);  // Gọi syscall sys_open qua libc
            char buf[10];
            read(fd, buf, 10);                    // Gọi syscall sys_read
            close(fd);                            // Gọi syscall sys_close
            return 0;
        }
        ```

    - **Cách hoạt động**: `libc` đóng gói syscall, thêm số syscall (syscall number) và gọi kernel.
- **Gọi trực tiếp `syscall` (thủ công):**
    - Dùng assembly hoặc macro trong C (như `syscall()` trên Linux).
    - **Ví dụ (C với `syscall`):**

        ```c
        #include <unistd.h>
        #include <sys/syscall.h>
        int main() {
            char buf[10];
            syscall(SYS_read, 0, buf, 10);  // Gọi sys_read trực tiếp (0 = STDIN)
            syscall(SYS_write, 1, buf, 10); // Gọi sys_write (1 = STDOUT)
            return 0;
        }
        ```

    - **Số `syscall`:**
        - Mỗi `syscall` có số định danh (xem `/usr/include/asm/unistd.h` trên Linux).
        - Ví dụ: `SYS_read = 0`, `SYS_write = 1`.
- **Assembly (thấp nhất):**
    - Dùng lệnh `int 0x80` (x86) hoặc `svc #0` (ARM) để gây ngắt phần cứng.
    - **Ví dụ (x86 Assembly):**

        ```nasm
        mov eax, 4    ; SYS_write
        mov ebx, 1    ; FD = STDOUT
        mov ecx, msg  ; Con trỏ đến chuỗi
        mov edx, len  ; Độ dài chuỗi
        int 0x80      ; Gọi syscall
        ```

    - Hiện đại hơn, dùng `syscall` thay `int 0x80` (nhanh hơn).

### **What happens with CPU when we execute a syscall?**

- Khi syscall được thực thi, CPU chuyển từ **user mode** sang **kernel mode** để kernel xử lý yêu cầu. Đây là quy trình chi tiết:
    1. **Chuẩn bị**: Chương trình đặt số `syscall` (syscall number) và tham số vào thanh ghi (registers). Ví dụ: `eax` (x86) chứa số `syscall`, `ebx`, `ecx` chứa tham số.
    2. **Gây ngắt**: Lệnh `int 0x80` (hoặc `syscall` trên x86-64) gây ngắt phần cứng, báo CPU chuyển sang kernel.
    3. **Chuyển mode**: CPU chuyển từ **user mode** (quyền thấp) sang **kernel mode** (quyền cao):
        - Lưu trạng thái user mode (PC, registers) vào stack.
        - Tải bảng ánh xạ kernel (kernel page table) qua MMU.
    4. **Xử lý syscall**:
        - CPU nhảy đến **syscall handler** trong kernel (địa chỉ được định nghĩa trong Interrupt Descriptor Table - IDT).
        - Kernel tra bảng syscall (system call table) bằng số syscall → chạy hàm tương ứng (như `sys_read`).
    5. **Hoàn tất**:
        - Kernel trả kết quả vào thanh ghi (thường `eax`).
        - CPU quay về user mode, khôi phục trạng thái, tiếp tục chạy chương trình.
- **Ví dụ: `read(0, buf, 10)`:**
    - User mode: Gọi `read()` → `int 0x80`.
    - Kernel mode: `sys_read` đọc từ STDIN → lưu vào `buf`.
    - Quay về user mode: Chương trình dùng dữ liệu trong `buf`.

### **What is user space and kernel space?**

- **User Space (Không gian người dùng):**
    - **Là gì?** Phần bộ nhớ và quyền hạn nơi các ứng dụng người dùng (như Chrome, Notepad) chạy.
    - **Đặc điểm:**
        - Quyền thấp: Không truy cập trực tiếp phần cứng (CPU, RAM, disk).
        - Dùng virtual memory riêng cho mỗi process.
        - Gọi `syscall` để yêu cầu kernel làm việc nặng (I/O, quản lý process).
    - **Ví dụ:** Code C trên chạy ở user space, gọi `open()` qua `libc`.
- **Kernel Space (Không gian kernel):**
    - **Là gì?** Phần bộ nhớ và quyền hạn dành riêng cho kernel, nơi quản lý phần cứng và tài nguyên hệ thống.
    - **Đặc điểm:**
        - Quyền cao: Truy cập trực tiếp phần cứng, quản lý process, file, mạng.
        - Một không gian bộ nhớ chung cho toàn hệ thống (khác với user space).
        - Chạy các hàm như `sys_read`, `sys_write`.
    - **Ví dụ:** Kernel xử lý `sys_open` để mở file trên disk.
- **Sự phân chia:**
    - **Phần cứng:** CPU có chế độ **ring** (x86):
        - Ring 3: User mode (low privilege).
        - Ring 0: Kernel mode (high privilege).
    - **Bộ nhớ:** Virtual address space chia thành hai phần:
        - User space: Địa chỉ thấp (`0x00000000` - `0xbfffffff` trên x86 32-bit).
        - Kernel space: Địa chỉ cao (`0xc0000000` - `0xffffffff`).
    - **Mục đích:** Bảo mật (ngăn user phá kernel), cô lập (process không ảnh hưởng nhau).
- **Ví dụ:** Chrome (user space) gọi `write()` → kernel (kernel space) ghi dữ liệu ra STDOUT → trả kết quả về Chrome.

## Caching

### What is in-memory cache? (memcached/redis)

- **Định nghĩa**:
    - **In-memory cache** (bộ nhớ đệm trong RAM) là một lớp lưu trữ dữ liệu tốc độ cao, giữ dữ liệu thường xuyên truy cập trong RAM thay vì lấy từ nơi chậm hơn như đĩa cứng hay cơ sở dữ liệu.
    - Ví dụ: **Memcached** và **Redis**.
- **Cách hoạt động**:
    - Dữ liệu được lưu dưới dạng cặp **key-value** trong RAM.
    - Khi ứng dụng cần dữ liệu, nó kiểm tra cache trước. Nếu có (cache hit), lấy ngay lập tức; nếu không (cache miss), lấy từ nguồn (như database) rồi lưu vào cache.
- **Memcached**:
    - Là một hệ thống lưu trữ key-value đơn giản, phân tán.
    - Hỗ trợ đa luồng, phù hợp cho caching cơ bản (không lưu lâu dài).
    - Ứng dụng: Tăng tốc ứng dụng web bằng cách lưu kết quả truy vấn database.
- **Redis**:
    - Là hệ thống lưu trữ trong RAM tiên tiến, hỗ trợ lưu lâu dài, các cấu trúc dữ liệu (danh sách, tập hợp), và pub/sub.
    - Dùng vòng lặp sự kiện đơn luồng (nhanh cho I/O), hỗ trợ sao chép.
    - Ứng dụng: Lưu cache, phiên người dùng, phân tích thời gian thực.
- **Tại sao dùng?**:
    - **Tốc độ**: Truy cập RAM nhanh hơn đĩa ~100 lần (nanosecond vs millisecond).
    - **Giảm tải**: Giảm áp lực cho database hoặc API.
- **Ví dụ**:
    - Truy vấn "user:123" → Redis trả về `{name: "Nam"}` trong 0.1ms thay vì 10ms từ MySQL.

### LRU? implement LRU in your program language! (How about multi-thread?)

- **Định nghĩa**:
    - **LRU** (Dùng Gần Đây Nhất) là chính sách xóa cache, loại bỏ các mục ít được dùng gần đây nhất khi cache đầy.
    - Ý tưởng: Giữ dữ liệu hay dùng, bỏ dữ liệu cũ/không dùng.
- **Cách hoạt động**:
    - Duy trì danh sách các mục theo thứ tự sử dụng.
    - Khi truy cập (get): Di chuyển mục lên vị trí "gần đây nhất".
    - Khi thêm (put): Nếu đầy, xóa mục "ít dùng nhất", thêm mục mới.

**Triển khai LRU trong Python**

- **Dùng OrderedDict (Đơn luồng)**:

    ```python
    from collections import OrderedDict
    
    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity  # Dung lượng tối đa
            self.cache = OrderedDict()  # Giữ thứ tự thêm vào
    
        def get(self, key):
            if key not in self.cache:
                return -1
            # Lấy giá trị, di chuyển lên cuối (gần đây nhất)
            value = self.cache.pop(key)
            self.cache[key] = value
            return value
    
        def put(self, key, value):
            if key in self.cache:
                self.cache.pop(key)  # Xóa mục cũ
            elif len(self.cache) >= self.capacity:
                self.cache.popitem(last=False)  # Xóa mục ít dùng nhất (đầu tiên)
            self.cache[key] = value  # Thêm vào cuối
    
    # Test
    cache = LRUCache(2)
    cache.put(1, 1)  # cache: {1:1}
    cache.put(2, 2)  # cache: {1:1, 2:2}
    print(cache.get(1))  # 1, cache: {2:2, 1:1}
    cache.put(3, 3)  # Xóa 2, cache: {1:1, 3:3}
    print(cache.get(2))  # -1 (miss)
    ```

    - **Giải thích**:
        - `OrderedDict`: Giữ thứ tự các key, `popitem(last=False)` xóa mục cũ nhất.
        - `get`: Lấy giá trị, đưa key lên cuối.
        - `put`: Thêm key-value, xóa cũ nhất nếu đầy.
- **LRU Đa luồng (Multi-thread):**
    - **Vấn đề**: Nhiều luồng truy cập cache cùng lúc có thể gây xung đột (race condition).
    - **Giải pháp**: Thêm khóa (lock) để an toàn.

    ```python
    from collections import OrderedDict
    import threading
    
    class LRUCacheThreadSafe:
        def __init__(self, capacity):
            self.capacity = capacity
            self.cache = OrderedDict()
            self.lock = threading.Lock()  # Khóa luồng
    
        def get(self, key):
            with self.lock:  # Khóa khi thao tác
                if key not in self.cache:
                    return -1
                value = self.cache.pop(key)
                self.cache[key] = value
                return value
    
        def put(self, key, value):
            with self.lock:  # Khóa khi thao tác
                if key in self.cache:
                    self.cache.pop(key)
                elif len(self.cache) >= self.capacity:
                    self.cache.popitem(last=False)
                self.cache[key] = value
    
    # Test với luồng
    def worker(cache, key, value):
        cache.put(key, value)
        print(f"Luồng {threading.current_thread().name}: get({key}) = {cache.get(key)}")
    
    cache = LRUCacheThreadSafe(2)
    threads = [threading.Thread(target=worker, args=(cache, i, i)) for i in range(4)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    ```

    - Giải thích:
        - `threading.Lock`: Đảm bảo chỉ một luồng thay đổi cache cùng lúc.
        - An toàn cho ứng dụng đa luồng (như web server).

### How to migrate `Cache stampede`?

- Là hiện tượng khi một key trong cache hết hạn, nhiều client cùng yêu cầu cùng lúc, gây quá tải cho backend (như database).
- Cách khắc phục:
    1. Làm mới sớm (**Early Refresh**)
    - Làm mới cache trước khi hết hạn (ví dụ: 80% TTL).
    - Ví dụ: Redis dùng luồng nền để làm mới key.
    1. Hết hạn ngẫu nhiên (**Probabilistic Early Expiration**)
    - Thêm độ ngẫu nhiên vào TTL (ví dụ: 100s ± 10s) để tránh hết hạn đồng loạt.
    1. Khóa (**Locking**)
    - Dùng khóa (như `SETNX` trong Redis) để chỉ một client làm mới cache, các client khác đợi.

        ```python
        if cache.get(key) is None:
            if acquire_lock(key):  # Chỉ một client khóa được
                value = fetch_from_db()
                cache.set(key, value)
                release_lock(key)
            else:
                wait_for_cache(key)  # Các client khác đợi
        ```

    1. Dùng dữ liệu cũ (**Stale Data**)
    - Phục vụ dữ liệu cũ trong khi làm mới cache ở nền.
- **Ví dụ**: Ứng dụng web lưu hồ sơ người dùng → khóa đảm bảo chỉ một lần truy database, các yêu cầu khác đợi.

### Quicksort(O(n²) in worst case) vs Merge sort (O(n log n) in worst case). Which is faster? Why? How they use these 2 sorting algorithms in real life?

- **Quicksort**
    - **Độ phức tạp**:
        - Trung bình: O(n log n).
        - Tệ nhất: O(n²) (ví dụ: mảng đã sắp xếp, chọn pivot kém).
    - **Cách hoạt động**: Chọn pivot, chia mảng, sắp xếp đệ quy các phần.
    - **Ưu**: Không cần thêm bộ nhớ (in-place), nhanh trong thực tế nhờ tận dụng cache CPU.
    - **Nhược**: Không ổn định (stable), tệ nhất O(n²).
- **Merge Sort**
    - **Độ phức tạp**: O(n log n) trong mọi trường hợp.
    - **Cách hoạt động**: Chia mảng thành nửa, sắp xếp đệ quy, gộp các nửa đã sắp xếp.
    - **Ưu**: Ổn định, luôn O(n log n).
    - **Nhược**: Cần bộ nhớ phụ O(n), chậm hơn trong thực tế do cấp phát bộ nhớ.
- Cái nào nhanh hơn?
    - **Thực tế**: Quicksort thường nhanh hơn (dù tệ nhất O(n²)) vì:
        - In-place → tận dụng cache tốt hơn (ít truy cập bộ nhớ).
        - Ít thao tác hơn trong trường hợp trung bình (pivot tối ưu như median-of-three).
    - **Tệ nhất**: Merge sort thắng (O(n log n) vs O(n²)).
    - **So sánh**: Với dữ liệu ngẫu nhiên, Quicksort nhanh hơn ~20-30%.
- Tại sao?
    - **Quicksort**: Ít overhead, thân thiện với bộ nhớ cache.
    - **Merge sort**: Cần thêm bộ nhớ và bước gộp làm chậm.
- Ứng dụng thực tế
    - **Quicksort**:
        - **Ứng dụng**: Thư viện sắp xếp (C `qsort`, Python `sort()` lấy ý tưởng từ Quicksort).
        - **Tại sao**: Nhanh cho sắp xếp trong RAM, dữ liệu nhỏ, ít gặp trường hợp tệ nhất.
        - **Ví dụ**: Sắp xếp danh sách ID người chơi trong game.
    - **Merge Sort**:
        - **Ứng dụng**: Sắp xếp ngoài (external sorting) trong database, cần ổn định.
        - **Tại sao**: Hiệu suất ổn định, tốt cho danh sách liên kết hoặc I/O đĩa.
        - **Ví dụ**: Sắp xếp file log trong Hadoop.