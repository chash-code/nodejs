Node.js Internals

1. Node.js Architecture
Node.js has a specific structure that makes it work efficiently. Here's how it's built:
JavaScript Engine (V8)
V8 is the engine created by Google that converts JavaScript code into machine code that computers can understand. Node.js uses V8 to run JavaScript outside the browser. V8 compiles JavaScript directly to native machine code before executing it, which makes it really fast. It also handles memory management and garbage collection automatically.
Node.js Core APIs
These are the built-in modules that Node.js provides to help us work with the system. Core APIs include things like file system operations (fs), networking (http, https), path handling, and more. These are written in JavaScript but they connect to lower-level C++ code to actually perform the operations. We can use these without installing any extra packages.
Native Bindings
Native bindings are the bridge between JavaScript code and C++ libraries. Since JavaScript can't directly talk to the operating system or hardware, Node.js uses C++ bindings to make this possible. For example, when we read a file using fs module, the JavaScript calls go through native bindings to the actual C++ code that talks to the OS.
Event Loop
The event loop is what makes Node.js non-blocking and asynchronous. It constantly checks if there are any tasks to execute. When we do something like reading a file or making a network request, Node.js doesn't wait for it to finish. Instead, it moves on to other tasks and comes back when the operation completes. The event loop manages all these asynchronous operations in the background.

2. libuv
What is libuv?
libuv is a C library that provides the event loop and handles all asynchronous operations in Node.js. It was originally created for Node.js but now other projects use it too. Think of it as the engine that powers Node.js's ability to do many things at once.
Why Node.js needs libuv
JavaScript is single-threaded, meaning it can only do one thing at a time. But modern applications need to handle multiple operations simultaneously like reading files, making network requests, and responding to user actions. libuv solves this by providing asynchronous I/O operations. It manages all the background tasks so that JavaScript can keep running without getting blocked.
Responsibilities of libuv
libuv handles several important jobs. It manages the event loop which schedules and executes asynchronous callbacks. It provides a thread pool for operations that can't be done asynchronously by the OS, like file system operations and DNS lookups. It also handles network I/O, file I/O, timers, and child processes. Basically, any time Node.js needs to do something outside of pure JavaScript computation, libuv is involved.

3. Thread Pool
What is a thread pool?
A thread pool is a collection of worker threads that libuv maintains to handle certain operations. By default, Node.js creates 4 threads in this pool (though you can change this). These threads work in the background, separate from the main JavaScript thread.
Why Node.js uses a thread pool
Even though Node.js is single-threaded for JavaScript execution, some operations can't be done asynchronously at the OS level. For example, file system operations on some operating systems don't have good async support. So instead of blocking the main thread, Node.js sends these operations to the thread pool where they run in parallel. This keeps the main event loop free to handle other tasks.
Which operations are handled by the thread pool
File system operations like reading, writing, and deleting files use the thread pool. DNS lookups (when you convert a domain name to an IP address) also use it. Some crypto operations and compression tasks go to the thread pool too. Basically, any operation that might take time and doesn't have native async support gets offloaded to these worker threads.

4. Worker Threads
What are worker threads?
Worker threads are a feature in Node.js that lets us create additional JavaScript threads. Unlike the thread pool which is internal to libuv, worker threads let us run JavaScript code in parallel. Each worker thread has its own V8 instance and event loop.
Why are worker threads needed?
The main JavaScript thread can get overwhelmed if we try to do heavy computational work like processing large amounts of data, image manipulation, or complex calculations. This blocks the event loop and makes the application unresponsive. Worker threads let us move this heavy work to separate threads, keeping the main thread free to handle requests and user interactions.
Difference between thread pool and worker threads
The thread pool is managed by libuv and runs C++ code for I/O operations. We don't have direct control over it. Worker threads, on the other hand, run JavaScript code and we create them explicitly in our application. Thread pool is for I/O operations, worker threads are for CPU-intensive JavaScript tasks. Also, worker threads can communicate with the main thread by passing messages, while thread pool operations just complete and return results.

5. Event Loop Queues
The event loop processes different types of tasks in a specific order using different queues.
Macro Task Queue
This queue holds tasks like setTimeout, setInterval, and I/O callbacks. These are the main tasks that the event loop processes. When you set a timer or perform a file read operation, the callback goes into this queue. The event loop picks tasks from here and executes them one at a time.
Micro Task Queue
This queue has higher priority than the macro task queue. It includes Promise callbacks and process.nextTick. After the event loop finishes executing a macro task, it immediately checks the micro task queue and runs all tasks in it before moving to the next macro task. This is why Promises can sometimes execute before timers even if the timer was set to 0 milliseconds.
Execution priority between them
The event loop always gives priority to the micro task queue. Here's how it works: execute one macro task, then execute ALL micro tasks, then check for any I/O operations, then move to the next macro task. This means if you keep adding micro tasks, you could theoretically block the event loop because it won't move forward until all micro tasks are done.
Examples of tasks in each queue
Macro task queue examples: setTimeout(() => console.log('timeout'), 0), file read callbacks, HTTP request callbacks. Micro task queue examples: Promise.then(() => console.log('promise')), process.nextTick(() => console.log('nextTick')), async/await operations. If you run a setTimeout and a Promise together, the Promise will always execute first because micro tasks have priority.
