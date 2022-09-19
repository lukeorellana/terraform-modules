import { Testing, TerraformStack} from 'cdktf';
import {AzurermProvider} from "@cdktf/provider-azurerm";
import { AzureContainerRegistry } from './AzureContainerRegistry';
import 'cdktf/lib/testing/adapters/jest';


// test('renders a VPC with minimal config', () => {
//   const synthed = Testing.synthScope((stack) => {
//     new PocketVPC(stack, 'testPocketVPC');
//   });


describe('AzureContainerRegistry-Snapshot', () => {
  it('renders a AzureContainerRegistry without tags', () => {

    const synthed = Testing.synthScope((stack) => {
      new AzureContainerRegistry(stack, 'testACR', {
        name: 'acrtest888',
        location: 'eastus',
        resource_group_name: "rg-test",
        sku: "Premium",
        admin_enabled: false,
        georeplication_locations: ["EastUS"],
      });
    });
  
    expect(synthed).toMatchSnapshot();
  });

  it('renders a AzureContainerRegistry with tags', () => {
    const synthed = Testing.synthScope((stack) => {
      new AzureContainerRegistry(stack, 'testACR', {
        name: 'acrtest888',
        location: 'eastus',
        resource_group_name: "rg-test",
        sku: "Premium",
        admin_enabled: false,
        georeplication_locations: ["EastUS"],
        tags: {
          environment: "test",
        },
      });
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureContainerRegistry-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });


    new AzureContainerRegistry(stack, 'testACR', {
      name: 'acrtest888',
      location: 'eastus',
      resource_group_name: "rg-test",
      sku: "Premium",
      admin_enabled: false,
      georeplication_locations: ["EastUS"],
      tags: {
        environment: "test",
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

    new AzureContainerRegistry(stack, 'testACR', {
      name: 'acrtest888',
      location: 'eastus',
      resource_group_name: "rg-test",
      sku: "Premium",
      admin_enabled: false,
      georeplication_locations: ["WestUS"],
      tags: {
        environment: "test",
      },
    });



    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
