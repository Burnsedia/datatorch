package utils

import (
	"runtime"
	"testing"
)

func TestWorkerPoolSize(t *testing.T) {
	pool := NewCPUSize()
	workers := len(pool.workers)
	if workers != runtime.NumCPU() {
		t.Errorf("Workers = %d; want %d", workers, runtime.NumCPU())
	}
	pool.Stop()
}

type TestJob struct {
	ID string
}

func (t *TestJob) Process() {}

func TestWorkerPool(t *testing.T) {
	pool := New(2)
	pool.Submit(&TestJob{ID: "1"})
	pool.Submit(&TestJob{ID: "2"})
	pool.Submit(&TestJob{ID: "3"})
	if pool.total != 3 {
		t.Errorf("Pool Total = %d; want 3", pool.total)
	}
	pool.Submit(&TestJob{ID: "4"})
	pool.Submit(&TestJob{ID: "5"})
	pool.Submit(&TestJob{ID: "6"})
	pool.Submit(&TestJob{ID: "7"})
	pool.Submit(&TestJob{ID: "8"})
	pool.Stop()

	if pool.total != 8 {
		t.Errorf("Pool Total = %d; want 8", pool.total)
	}
	if pool.Completed() != 8 {
		t.Errorf("Pool Completed = %d; want 8", pool.Completed())
	}
	if !pool.IsEmpty() {
		t.Errorf("IsFinished = %t; want true", pool.IsEmpty())
	}
}
