package dev

import (
	"os/exec"

	"github.com/gookit/color"
)

// WebDevProcess starts the web client in development mode.
var WebDevProcess = &Process{
	prefix: color.Style{color.BgCyan.Darken(), color.White}.Render("[ WEB ]"),
	cmd:    exec.Command("yarn", "dev"),
	dir:    "clients/web",

	// Force enable color for nextjs
	env: []string{"FORCE_COLOR=true"},

	envDeps: []Dependency{Dependencies["yarn"], Dependencies["node"]},
}

// RunDevWeb runs the webclient in development mode and streams output to stdout
// func RunDevWeb() (run *exec.Cmd, err error) {
// 	run = exec.Command("yarn", "dev")
// 	run.Dir = "clients/web"
// 	run.Env = os.Environ()
// 	// Force enable color for nextjs
// 	run.Env = append(os.Environ(), "FORCE_COLOR=true")
// 	prefix := color.Style{color.BgCyan.Darken(), color.White}.Render("[ WEB ]")
// 	err = PrefixCommandOutput(prefix, run)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return run, run.Start()
// }
