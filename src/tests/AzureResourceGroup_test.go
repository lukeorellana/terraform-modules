package test

import (
	"strings"
	"testing"

	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureResourceGroupExample(t *testing.T) {
	t.Parallel()

	var regions = []string{
		"eastus",
	}

	// Pick a random Azure region to test in.
	azureRegion := random.RandomString(regions)

	// Randomize System Name
	rndName := strings.ToLower(random.UniqueId()) + "appconfig"

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: "../examples/app_config",

		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"name":     rndName,
			"location": azureRegion,
		},
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)
}
