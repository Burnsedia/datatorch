package main

import (
	"github.com/datatorch/datatorch/clients/cli/cmds"
)

func main() {
	root := cmds.NewCmdRoot()
	root.Execute()
}
