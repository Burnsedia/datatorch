package dev

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
)

// Process is a process that runs forever
type Process struct {
	prefix string
	cmd    *exec.Cmd
	env    []string
	dir    string

	envDeps     []Dependency
	processDeps []Process
}

// EnvCheck checks environment for dependencies.
func (p *Process) EnvCheck() error {
	deps := p.envDeps
	appendIfDependencyMissing := func(dependency Dependency) {
		for _, dep := range deps {
			if dependency.Name == dep.Name {
				return
			}
		}
		deps = append(deps, dependency)
	}
	for _, pDep := range p.AllProcessDependencies() {
		for _, dep := range pDep.envDeps {
			appendIfDependencyMissing(dep)
		}
	}

	for _, dep := range deps {
		if err := dep.CliCheck(); err != nil {
			return nil
		}
	}

	return nil
}

// AllProcessDependencies returns an unique array of all process dependencies
// recursively including all children
func (p *Process) AllProcessDependencies() []Process {
	deps := []Process{}
	appendIfDependencyMissing := func(process Process) {
		for _, dep := range deps {
			if process.prefix == dep.prefix {
				return
			}
		}
		deps = append(deps, process)
	}

	for _, dep := range p.processDeps {
		for _, childDep := range dep.AllProcessDependencies() {
			appendIfDependencyMissing(childDep)
		}
		appendIfDependencyMissing(dep)
	}

	return deps
}

// StartAll process along with all subprocesses
func (p *Process) StartAll() error {

	for _, dep := range p.AllProcessDependencies() {
		if err := dep.Start(); err != nil {
			return err
		}
	}

	return p.Start()
}

// Wait waits for command to finish
func (p *Process) Wait() error {
	return p.cmd.Wait()
}

// Start process along with all subprocesses
func (p *Process) Start() error {

	p.cmd.Env = append(os.Environ(), p.env...)
	p.cmd.Dir = p.dir

	p.streamOutput()
	return p.cmd.Start()
}

func (p *Process) streamOutput() error {
	stdout, err := p.cmd.StdoutPipe()
	if err != nil {
		return err
	}
	stderr, err := p.cmd.StderrPipe()
	if err != nil {
		return err
	}

	go prefixPipe(p.prefix, stdout)
	go prefixPipe(p.prefix, stderr)

	return nil
}

func prefixPipe(prefix string, read io.ReadCloser) {
	reader := bufio.NewReader(read)
	for {
		strline, err := readLine(reader)
		if err != nil && err != io.EOF {
			log.Fatal(err)
		}
		if len(strline) > 0 {
			fmt.Printf("%s %s\n", prefix, strline)
		}
		if err == io.EOF {
			break
		}
	}
}

func readLine(reader *bufio.Reader) (strline string, err error) {
	buffer := new(bytes.Buffer)
	for {
		var line []byte
		var isPrefix bool
		line, isPrefix, err = reader.ReadLine()

		if err != nil && err != io.EOF {
			return "", err
		}

		buffer.Write(line)

		if !isPrefix {
			break
		}
	}

	return buffer.String(), err
}
