import { Testing, TerraformStack} from 'cdktf';
import {AzurermProvider} from "@cdktf/provider-azurerm";
import { AzureResourceGroup } from './AzureResourceGroup';
import 'cdktf/lib/testing/adapters/jest';


// test('renders a VPC with minimal config', () => {
//   const synthed = Testing.synthScope((stack) => {
//     new PocketVPC(stack, 'testPocketVPC');
//   });


describe('AzureResourceGroup-Snapshot', () => {
  it('renders a AzureResourceGroup without tags', () => {

    const synthed = Testing.synthScope((stack) => {
      new AzureResourceGroup(stack, 'testRG', {
        name: 'rg-test',
        location: 'eastus',
      });
    });
    expect(synthed).toMatchSnapshot();
  });

  it('renders a AzureResourceGroup with tags', () => {
    const synthed = Testing.synthScope((stack) => {
      new AzureResourceGroup(stack, 'testRG', {
        name: 'rg-test',
        location: 'eastus',
        tags: {
          name: 'rug',
          description: 'test environmnet',
        },
      });
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureResourceGroup-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });


    new AzureResourceGroup(stack, 'testRG', {
      name: 'rg-test',
      location: 'eastus',
      tags: {
        name: 'test',
        Env: "NonProd",
      },
    });


    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });

    new AzureResourceGroup(stack, 'testRG', {
      name: 'rg-test',
      location: 'eastus',
      tags: {
        name: 'test',
        Env: "NonProd",
      },
    });



    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
