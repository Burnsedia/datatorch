package dev

import (
	"fmt"

	"github.com/Masterminds/semver"
	"github.com/gookit/color"
	"github.com/pterm/pterm"
	"github.com/spf13/cobra"
)

func section(title string) {
	section := color.Style{color.OpBold}
	section.Println(title)
}

func subsection(title string) {
	fmt.Printf("   %s\n", title)
}

// NewCmdCheck setups environment check command.
func NewCmdCheck() *cobra.Command {
	return &cobra.Command{
		Use:   "check",
		Short: "Checks environment for proper configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {

			section("Development Tools")
			subsection("Required")
			checkForDep("node")
			checkForDep("go")
			checkForDep("yarn")
			checkForDep("docker")
			checkForDep("docker-compose")
			subsection("Optional")
			checkForDep("vscode")

			section("\nDeployment Tools")
			subsection("Kubernetes")
			checkForDep("kubectl")
			checkForDep("helm")
			subsection("Cloud")
			checkForDep("terraform")

			return nil
		},
	}
}

func checkForDep(depName string) {
	dep := Dependencies[depName]

	spinner, _ := pterm.DefaultSpinner.Start("Checking for ", dep.Name)
	spinner.RemoveWhenDone = true
	version, err := dep.GetVersion()

	var status string
	var extra string

	if err != nil {
		status = color.Red.Render("MISSING")
		extra = fmt.Sprintf("Download from %s", dep.URL)
	} else {
		c, _ := semver.NewConstraint(dep.VersionContratins)
		if c.Check(version) {
			status = color.Green.Render("INSTALLED")
			extra = version.String()
		} else {
			status = color.Yellow.Render("OUTDATED")
			extra = fmt.Sprintf("Found %s, but version must be %s", version.String(), dep.VersionContratins)
		}
	}
	spinner.Stop()
	fmt.Printf("      %s\t%s %s\n", status, dep.Name, color.Gray.Render(extra))
}
