package login

import (
	"fmt"

	"github.com/MakeNowJust/heredoc/v2"
	"github.com/spf13/cobra"
)

// NewCmdLogin Creates login command
func NewCmdLogin() *cobra.Command {
	cmd := &cobra.Command{
		Use: "login",
		Short: "Authenticate with DataTorch host",
		Long: heredoc.Doc(`
			Authenticate with DataTorch host.

			The default authentication mode is a api key flow.
		`),
		Example: heredoc.Doc(`
			# authenticate with a specific DataTorch instance
			$ dt login --hostname enterprise.internal
		`),
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Hello")
			return nil
		},
	}
	return cmd
}