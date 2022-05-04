package dev

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/pkg/browser"
	"github.com/pterm/pterm"
	"github.com/spf13/cobra"
)

// NewCmdDevWeb command to sign up web in development mode
func NewCmdDevWeb() *cobra.Command {
	return &cobra.Command{
		Use:   "web",
		Short: "Spin up all services required services for web development.",
		RunE: func(cmd *cobra.Command, args []string) error {
			WebDevProcess.EnvCheck()
			yarnInstall()
			WebDevProcess.StartAll()
			browser.OpenURL("http://localhost:3000")
			WebDevProcess.Wait()
			return nil
		},
	}
}

func yarnInstall() error {
	spinner, _ := pterm.DefaultSpinner.Start("Downloading npm dependencies...")
	spinner.RemoveWhenDone = true
	install := exec.Command("yarn", "install")
	install.Stderr = os.Stderr
	if err := install.Start(); err != nil {
		spinner.Stop()
		return err
	}

	if err := install.Wait(); err != nil {
		spinner.Stop()
		return err
	}
	spinner.Stop()
	return nil
}

func goInstall() error {
	spinner, _ := pterm.DefaultSpinner.Start("Downloading go dependencies...")
	spinner.RemoveWhenDone = true
	install := exec.Command("go", "mod", "download")
	install.Stderr = os.Stderr
	if err := install.Start(); err != nil {
		spinner.Stop()
		return err
	}
	if err := install.Wait(); err != nil {
		spinner.Stop()
		return err
	}
	spinner.Stop()
	return nil
}

// NewCmdDevInstall command to install dependencies
func NewCmdDevInstall() *cobra.Command {
	return &cobra.Command{
		Use:   "install",
		Short: "Downloads all go and npm packages.",
		Run: func(cmd *cobra.Command, args []string) {

			node := Dependencies["node"]
			node.CliCheck()
			yarn := Dependencies["yarn"]
			yarn.CliCheck()
			golang := Dependencies["go"]
			golang.CliCheck()

			err := yarnInstall()
			if err != nil {
				fmt.Println("Could not install javascript dependencies.")
				fmt.Println("Run `datatorch dev check` to check environment configuration.")
			}
			err = goInstall()
			if err != nil {
				fmt.Println("Could not install goalng dependencies.")
			}

			if err != nil {
				fmt.Println("Run `datatorch dev check` to check environment configuration.")
				return
			}

			fmt.Println("All dependencies have been installed.")
		},
	}
}
