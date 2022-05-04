package dev

import (
	"fmt"

	"github.com/Masterminds/semver"
	"github.com/pterm/pterm"
)

// Dependency is an environment program require to develop DataTorch
type Dependency struct {
	Name              string
	VersionContratins string
	URL               string
	OS                []string
	// Install is an optional function that attempts to install a the dependency
	Install    func() error
	GetVersion func() (*semver.Version, error)
}

// CliCheck checks the if the dependencies is install and displays nice a
// interface in the commandline
func (dep *Dependency) CliCheck() error {
	spinner, _ := pterm.DefaultSpinner.Start("Checking for ", dep.Name)
	spinner.RemoveWhenDone = true
	version, err := dep.GetVersion()

	spinner.Stop()

	if err != nil {
		fmt.Printf("Missing dependency %s.\n", dep.Name)
		fmt.Println("Run `datatorch dev check` to check environment configuration.")
		return err
	}

	c, _ := semver.NewConstraint(dep.VersionContratins)
	if !c.Check(version) {
		fmt.Printf("Found %s, but version must be %s", version.String(), dep.VersionContratins)
		fmt.Println("Run `datatorch dev check` to check environment configuration.")
		return semver.ErrInvalidSemVer
	}

	return nil
}
