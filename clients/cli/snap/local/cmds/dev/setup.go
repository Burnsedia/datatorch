package dev

import (
	"github.com/spf13/cobra"
)

// NewCmdSetup setups environment setup command.
func NewCmdSetup() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "setup",
		Short: "Attempts to configure environment.",
		RunE: func(cmd *cobra.Command, args []string) error {

			return nil
		},
	}

	return cmd
}
