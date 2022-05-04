package utils

import (
	"runtime"
	"sync"
)

// Job excutes workers
type Job interface {
	Process()
}

type jobWorker struct {
	quit  chan bool
	job   chan Job
	done  *sync.WaitGroup
	ready chan chan Job
}

func newWorker(ready chan chan Job, done *sync.WaitGroup) *jobWorker {
	return &jobWorker{
		ready: ready,
		done:  done,
		quit:  make(chan bool),
		job:   make(chan Job),
	}
}

func (worker *jobWorker) stop() {
	worker.quit <- true
}

func (worker *jobWorker) start() {
	worker.done.Add(1)
	go func() {
		for {
			worker.ready <- worker.job
			select {
			case job := <-worker.job:
				job.Process()
			case <-worker.quit:
				worker.done.Done()
				return
			}
		}
	}()
}

// WorkerPool excute jobs using workers
type WorkerPool struct {
	total       int
	closed      bool
	queue       chan Job
	quit        chan bool
	workers     []*jobWorker
	workersDone *sync.WaitGroup
	ready       chan chan Job
	dispatcher  sync.WaitGroup
}

// New contructs a worker pool
func New(maxWorkers int) *WorkerPool {

	workers := make([]*jobWorker, maxWorkers)
	ready := make(chan chan Job, maxWorkers)
	workersDone := &sync.WaitGroup{}

	for i := 0; i < maxWorkers; i++ {
		workers[i] = newWorker(ready, workersDone)
	}

	pool := &WorkerPool{
		queue:       make(chan Job),
		quit:        make(chan bool),
		workers:     workers,
		workersDone: workersDone,
		ready:       ready,
		dispatcher:  sync.WaitGroup{},
	}

	pool.start()
	return pool
}

// Pending returns the number of jobs in the waiting queue
func (q *WorkerPool) Pending() int {
	return len(q.queue)
}

// Running returns the number of jobs being executed
func (q *WorkerPool) Running() int {
	return len(q.workers) - len(q.ready)
}

// Completed returns the number of jobs that have been completed
func (q *WorkerPool) Completed() int {
	return q.total - q.Running() - q.Pending()
}

// IsEmpty returns true if no jobs are being executed and no jobs are pending
func (q *WorkerPool) IsEmpty() bool {
	return q.Pending() == 0 && q.Running() == 0
}

// IsClosed returns if the queue has been flag to exit (by calling Close())
func (q *WorkerPool) IsClosed() bool {
	return q.closed
}

// Start initializes job queue
func (q *WorkerPool) start() {
	for i := 0; i < len(q.workers); i++ {
		q.workers[i].start()
	}

	q.dispatcher.Add(1)
	go func() {
		stop := false
		for {
			select {
			case job := <-q.queue:
				worker := <-q.ready
				worker <- job
			case <-q.quit:
				stop = true
				println("stop got")
			}
			if stop && q.IsEmpty() {
				for i := 0; i < len(q.workers); i++ {
					q.workers[i].stop()
				}
				q.workersDone.Wait()
				q.dispatcher.Done()
				return
			}
		}
	}()
}

// Submit adds a new job to be processed
func (q *WorkerPool) Submit(job Job) {
	q.total++
	q.queue <- job
}

// Stop will block until queue finish and then cleanup.
func (q *WorkerPool) Stop() {
	q.closed = true
	q.quit <- true
	q.dispatcher.Wait()
	close(q.queue)
}

// IsActive returns true is finished processing all jobs the pool is closed.
func (q *WorkerPool) IsActive() bool {
	return !q.IsClosed() && !q.IsEmpty()
}

// NewCPUSize creates a new queue with the number of CPI
func NewCPUSize() *WorkerPool {
	return New(runtime.NumCPU())
}
