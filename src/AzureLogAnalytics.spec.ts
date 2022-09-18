import { Testing, TerraformStack} from 'cdktf';
import {AzurermProvider} from "@cdktf/provider-azurerm";
import { AzureLogAnalytics } from './AzureLogAnalytics';
import 'cdktf/lib/testing/adapters/jest';


// test('renders a VPC with minimal config', () => {
//   const synthed = Testing.synthScope((stack) => {
//     new PocketVPC(stack, 'testPocketVPC');
//   });


describe('AzureLogAnalytics-Snapshot', () => {
  it('renders a AzureLogAnalytics without tags', () => {

    const synthed = Testing.synthScope((stack) => {
      new AzureLogAnalytics(stack, 'testLA', {
        name: 'la-test',
        location: 'eastus',
        retention: 90,
        sku: "PerGB2018",
        resource_group_name: "rg-test",
      });
    });
  
    expect(synthed).toMatchSnapshot();
  });

  it('renders a AzureLogAnalytics with tags', () => {
    const synthed = Testing.synthScope((stack) => {
      new AzureLogAnalytics(stack, 'testLA', {
        name: 'la-test',
        location: 'eastus',
        tags: {
          environment: "test",
        },
        retention: 90,
        sku: "PerGB2018",
        resource_group_name: "rg-test",
      });
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureLogAnalytics-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });


    new AzureLogAnalytics(stack, 'testLA', {
      name: 'la-test',
      location: 'eastus',
      tags: {
        environment: "test",
      },
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: "rg-test",
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

    new AzureLogAnalytics(stack, 'testLA', {
      name: 'la-test',
      location: 'eastus',
      tags: {
        environment: "test",
      },
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: "rg-test",
    });



    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
