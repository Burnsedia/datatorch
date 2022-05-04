package files

import (
	"github.com/datatorch/datatorch/clients/cli/pkg/utils"
)

type LoaderJob struct {
	utils.Job

	total  chan int64
	loaded chan int64
}

type Loader struct {
	pool *utils.WorkerPool

	Loaded int64
	loaded chan int64
	Total  int64
	total  chan int64
}

// NewLoader constructs a loader
func NewLoader(pool *utils.WorkerPool) *Loader {
	loader := &Loader{
		pool:   pool,
		loaded: make(chan int64),
		total:  make(chan int64),
	}

	go func() {
		for {
			select {
			case b := <-loader.total:
				loader.Total += b
			case b := <-loader.loaded:
				loader.Loaded += b
			}
		}
	}()

	return loader
}

// Submit queues a loader job
func (loader *Loader) Submit(job *LoaderJob) {
	job.loaded = loader.loaded
	job.total = loader.total
	loader.pool.Submit(job)
}

// Close closes a loader
func (loader *Loader) Close() {
	close(loader.total)
	close(loader.loaded)
	loader.Loaded = 0
	loader.Total = 0
}
