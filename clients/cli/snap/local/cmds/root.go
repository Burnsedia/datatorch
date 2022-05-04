package cmds

import (
	devCmd "github.com/datatorch/datatorch/clients/cli/cmds/dev"
	loginCmd "github.com/datatorch/datatorch/clients/cli/cmds/login"
	"github.com/spf13/cobra"
)

// NewCmdRoot creates root command
func NewCmdRoot() *cobra.Command {
	cmd := &cobra.Command{
		Short: "DataTorch CLI",
		Long:  `Work seamlessly with DataTorch from command line.`,
	}

	cmd.AddCommand(loginCmd.NewCmdLogin())
	cmd.AddCommand(devCmd.NewCmdDev())

	return cmd
}
