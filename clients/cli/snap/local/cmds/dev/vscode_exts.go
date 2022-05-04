package dev

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/AlecAivazis/survey/v2"
	"github.com/dustin/go-humanize/english"
	"github.com/gookit/color"
	"github.com/spf13/cobra"
)

var recommended = []string{
	"Prisma.prisma",
	"golang.go",
	"esbenp.prettier-vscode",
	"dbaeumer.vscode-eslint",
	"hashicorp.terraform",
	"stkb.rewrap",
	"zxh404.vscode-proto3",
	"yzhang.markdown-all-in-one",
	"vscode-icons-team.vscode-icons",
	"rbbit.typescript-hero",
	"ms-python.python",
}

// NewCmdVscodeExtensions setups command to for installing recommended VSCode
// extensions.
func NewCmdVscodeExtensions() *cobra.Command {
	return &cobra.Command{
		Use:   "vscode-ext",
		Short: "Prompts user to select from a list of recommended VSCode extensions.",
		Run: func(cmd *cobra.Command, args []string) {
			vscode := Dependencies["vscode"]
			version, err := vscode.GetVersion()
			if err != nil {
				fmt.Println("Could not find Visual Studio Code. Is it installed?")
				fmt.Printf("Error Message: %s\n", color.Gray.Render(err.Error()))
				os.Exit(1)
			}
			fmt.Printf("Found version %s of Visual Studio Code\n", color.Green.Render(version.String()))

			currentExtensionsString, err := exec.Command("code", "--list-extensions").Output()
			if err != nil {
				fmt.Println("Could not list extensions already installed?")
				fmt.Printf("Error Message: %s\n", color.Gray.Render(err.Error()))
				os.Exit(2)
			}

			installedExtentsions := strings.Split(string(currentExtensionsString), "\n")
			installedExtensionsCount := len(installedExtentsions)
			english.PluralWord(installedExtensionsCount, "extension", "")
			fmt.Printf("You current have %s %s already installed\n",
				color.Blue.Render(installedExtensionsCount),
				english.PluralWord(installedExtensionsCount, "extension", ""))

			extAlreadyInstalled := func(ext string) bool {
				for _, installedExt := range installedExtentsions {
					if strings.HasPrefix(installedExt, ext) {
						return true
					}
				}
				return false
			}

			notInstalled := []string{}
			for _, ext := range recommended {
				if !extAlreadyInstalled(ext) {
					notInstalled = append(notInstalled, ext)
				}
			}

			if len(notInstalled) == 0 {
				fmt.Println("You already have all the recommend extensions installed.")
				return
			}

			toInstall := []string{}
			prompt := &survey.MultiSelect{
				Message: "Which extentions would you like to install?",
				Options: notInstalled,
			}
			survey.AskOne(prompt, &toInstall)

			// TODO: Install extensions
			// for _, ext := range toInstall {
			// 	cmd
			// }

			fmt.Println("Ops - something went wrong.")
			// fmt.Println("Done installing extensions.")
			// fmt.Println("You may have to reopen Visual studio code to see changes.")
		},
	}
}
