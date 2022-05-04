package files

import (
	"io"
	"net/http"
	"os"
	"strconv"
)

// DownloadJob downloads files
type DownloadJob struct {
	LoaderJob
	io.Writer

	Path string
	URL  string
}

func (download *DownloadJob) Write(p []byte) (int, error) {
	n := len(p)
	download.loaded <- int64(n)
	return n, nil
}

// Process downloads provided file in job
func (download *DownloadJob) Process() {
	out, err := os.Create(download.Path)
	if err != nil {
		return
	}
	defer out.Close()

	resp, err := http.Get(download.URL)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	size, _ := strconv.Atoi(resp.Header.Get("Content-Length"))
	download.total <- int64(size)

	loaded, err := io.Copy(out, io.TeeReader(resp.Body, download))
	if err != nil {
		download.total <- -int64(size)
		download.loaded <- -loaded
	}
}
