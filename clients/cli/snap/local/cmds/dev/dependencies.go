package dev

import (
	"encoding/json"
	"os/exec"
	"strings"

	"github.com/Masterminds/semver"
)

func getCommandOutput(name string, args ...string) (string, error) {
	cmd := exec.Command(name, args...)
	output, err := cmd.Output()
	v := string(output)
	v = strings.Trim(v, "\n")
	v = strings.Trim(v, "\r")
	return v, err
}

// Dependencies map of option and required dependencies for developing
// DataTorch
var Dependencies = map[string]Dependency{
	"node": {
		Name:              "NodeJS",
		URL:               "https://nodejs.org/en/download/",
		VersionContratins: ">= 12",

		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("node", "-v")
			if err != nil {
				return nil, err
			}
			return semver.NewVersion(version)
		},
	},
	"yarn": {
		Name:              "Yarn",
		URL:               "https://yarnpkg.com/getting-started/install",
		VersionContratins: ">= 2",

		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("yarn", "-v")
			if err != nil {
				return nil, err
			}
			return semver.NewVersion(version)
		},
	},
	"docker": {
		Name:              "Docker",
		URL:               "https://docs.docker.com/desktop/",
		VersionContratins: ">= 19",

		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("docker", "version", "--format", "{{.Client.Version}}")
			if err != nil {
				return nil, err
			}
			return semver.NewVersion(version)
		},
	},
	"docker-compose": {
		Name:              "Docker Compose",
		URL:               "https://docs.docker.com/compose/install/",
		VersionContratins: ">= 1",

		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("docker-compose", "version", "--short")
			if err != nil {
				return nil, err
			}
			return semver.NewVersion(version)
		},
	},
	"vscode": {
		Name:              "Visual Studio Code",
		URL:               "https://code.visualstudio.com/download",
		VersionContratins: ">= 1.50",
		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("code", "--version")
			if err != nil {
				return nil, err
			}
			version = strings.Split(version, "\n")[0]
			version = strings.Trim(version, "\r")
			return semver.NewVersion(version)
		},
	},
	"kubectl": {
		Name:              "Kubectl",
		URL:               "https://kubernetes.io/docs/tasks/tools/",
		VersionContratins: ">= 1.15",
		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("kubectl", "version", "--client", "-o", "json")
			if err != nil {
				return nil, err
			}

			type ClientVersion struct {
				GitVersion string
			}
			type Info struct {
				ClientVersion ClientVersion
			}
			var info Info
			err = json.Unmarshal([]byte(version), &info)
			if err != nil {
				return nil, err
			}

			return semver.NewVersion(info.ClientVersion.GitVersion)
		},
	},
	"helm": {
		Name:              "Helm",
		URL:               "https://helm.sh/docs/intro/install/",
		VersionContratins: ">= 3",
		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("helm", "version", "--template", "{{.Version}}")
			if err != nil {
				return nil, err
			}

			type ClientVersion struct {
				GitVersion string
			}
			type Info struct {
				ClientVersion ClientVersion
			}
			var info Info
			err = json.Unmarshal([]byte(version), &info)
			if err != nil {
				return nil, err
			}

			return semver.NewVersion(info.ClientVersion.GitVersion)
		},
	},
	"go": {
		Name:              "Go",
		URL:               "https://golang.org/doc/install",
		VersionContratins: ">= 1.16",
		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("go", "version")
			if err != nil {
				return nil, err
			}

			version = strings.Split(version, " ")[2]
			version = strings.TrimPrefix(version, "go")

			return semver.NewVersion(version)
		},
	},
	"terraform": {
		Name:              "Terraform",
		URL:               "https://www.terraform.io/downloads.html",
		VersionContratins: ">= 0.14",
		GetVersion: func() (*semver.Version, error) {
			version, err := getCommandOutput("terraform", "-version")
			if err != nil {
				return nil, err
			}
			version = strings.Split(version, " ")[1]
			return semver.NewVersion(version)
		},
	},
}
