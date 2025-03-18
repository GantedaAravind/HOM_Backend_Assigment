class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(task) {
    this.heap.push(task);
    this.heap.sort((a, b) => this.compareTasks(a, b)); // Keep heap sorted
  }

  compareTasks(a, b) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt) - new Date(b.createdAt); // Earlier tasks come first
  }

  getSortedTasks() {
    return this.heap;
  }
}

const taskScheduler = (tasks) => {
  const heap = new MinHeap();
  tasks.forEach((task) => heap.insert(task));
  return heap.getSortedTasks();
};

module.exports = taskScheduler;
